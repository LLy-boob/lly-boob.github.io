// Serverless Score Validation API
// Deploy to Vercel: vercel deploy
// Or Netlify: netlify deploy

const crypto = require('crypto');

// Environment variable (set in Vercel/Netlify dashboard)
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-this';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://lly-boob.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { score, timestamp, gameTime, cubeCount, hash, biome } = req.body;
        
        // 1. Validate hash (prevents tampering)
        const expectedHash = crypto
            .createHash('sha256')
            .update(`${score}:${timestamp}:${gameTime}:${SECRET_KEY}`)
            .digest('hex');
        
        if (hash !== expectedHash) {
            console.log('❌ Invalid hash - possible tampering');
            return res.status(400).json({ error: 'Invalid signature' });
        }
        
        // 2. Check timestamp is recent (within 5 minutes)
        const now = Date.now();
        if (Math.abs(now - timestamp) > 300000) {
            console.log('❌ Timestamp too old');
            return res.status(400).json({ error: 'Expired submission' });
        }
        
        // 3. Validate score is realistic
        const maxPointsPerSecond = 15; // Adjust based on your game
        const maxPossibleScore = (gameTime / 1000) * maxPointsPerSecond;
        
        if (score > maxPossibleScore * 1.2) { // 20% tolerance
            console.log(`❌ Impossible score: ${score} in ${gameTime}ms`);
            return res.status(400).json({ error: 'Impossible score' });
        }
        
        // 4. Validate cubes vs score ratio
        const avgPointsPerCube = score / cubeCount;
        if (avgPointsPerCube > 100 || avgPointsPerCube < 1) {
            console.log('❌ Suspicious cube/score ratio');
            return res.status(400).json({ error: 'Invalid game data' });
        }
        
        // 5. Rate limiting (simple in-memory, use Redis for production)
        // TODO: Implement proper rate limiting
        
        // 6. Save to database (implement your DB logic here)
        // await saveScoreToDatabase({ score, timestamp, gameTime, cubeCount, biome });
        
        console.log(`✅ Valid score: ${score} (${gameTime}ms, ${cubeCount} cubes)`);
        
        return res.status(200).json({ 
            success: true,
            message: 'Score validated and saved',
            rank: 1 // TODO: Calculate actual rank from database
        });
        
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}

// Helper function to save to database (implement based on your DB)
async function saveScoreToDatabase(data) {
    // Example with Vercel Postgres:
    // const { sql } = require('@vercel/postgres');
    // await sql`INSERT INTO scores (score, timestamp, game_time, cube_count, biome) 
    //           VALUES (${data.score}, ${data.timestamp}, ${data.gameTime}, ${data.cubeCount}, ${data.biome})`;
    
    // Example with Firebase:
    // const admin = require('firebase-admin');
    // await admin.firestore().collection('scores').add(data);
    
    console.log('TODO: Implement database save');
}
