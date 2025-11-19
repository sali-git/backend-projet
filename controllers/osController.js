const os = require("os");


module.exports.getOsInformation = async (req,res) => {
    try {
        //..
        const getOsInformation = {
            hostname: os.hostname(),
            type : os.type(),
            platform : os.platform(),

        }
        res.status(200).json({getOsInformation});

    }
    catch (error) {

        res.status(500).json({message: error.message});
    }
}