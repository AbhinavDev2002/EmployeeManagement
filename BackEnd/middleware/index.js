const fs = require('fs');

function formatDate(date) {
    // Get the date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}

function logReqRes(filename){
    return (req, res, next) =>{
        const date = new Date(); // Get the current date
        const formattedDate = formatDate(date); // Format the date
        fs.appendFile(
            filename,
            `${formattedDate} : ${req.ip} ${req.method}:${req.path}\n`,
            (err, data) => {
                next();
            }
        );
    };
};

module.exports = {
    logReqRes,
}