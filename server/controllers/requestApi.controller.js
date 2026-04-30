import axios from "axios";

export const TestApi = async (req, res) => {
    const { url, method, body, headers } = req.body;
    
    if (!url || !method) {
        return res.status(400).json({
            message: "URL and Method are required"
        });
    }

    try {
        const startTime = new Date().getTime();
        
        const response = await axios({
            url,
            method,
            data: body || undefined,
            headers: headers || {},
            validateStatus: () => true // Resolve on any status code so we don't throw for 404/500
        });

        const endTime = new Date().getTime();
        const timeTaken = endTime - startTime;

        // Calculate size (very rough estimate based on stringified data)
        let size = 0;
        if (response.data) {
            size = Buffer.byteLength(JSON.stringify(response.data));
        }

        return res.status(200).json({
            success: true,
            status: response.status,
            statusText: response.statusText,
            time: timeTaken,
            size: size,
            headers: response.headers,
            data: response.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch",
            error: error.message
        });
    }
};
