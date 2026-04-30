import History from "../models/history.model.js";

export const getHistory = async (req, res) => {
    try {
        const history = await History.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(50);
        return res.status(200).json({ success: true, data: history });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Failed to fetch history" });
    }
};

export const createHistory = async (req, res) => {
    try {
        const { url, method, status, time } = req.body;
        
        if (!url || !method) {
            return res.status(400).json({ success: false, msg: "URL and Method required" });
        }

        const newHistory = new History({
            user: req.user.id,
            url,
            method,
            status,
            time
        });

        await newHistory.save();
        return res.status(201).json({ success: true, data: newHistory });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Failed to save history" });
    }
};

export const clearHistory = async (req, res) => {
    try {
        await History.deleteMany({ user: req.user.id });
        return res.status(200).json({ success: true, msg: "History cleared" });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Failed to clear history" });
    }
};
