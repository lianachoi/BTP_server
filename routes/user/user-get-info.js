const models = require("../../models");
const errors = require("../errors/errors");
const moment = require('moment');

module.exports = async (req, res) => {
    if(!req.user) {
        res.status(200).json({
            "result": "FAIL",
            "resultcode": "-100",
            "message": "로그인하지 않은 유저"
        });
        return;
    };
    try {        
        // 유저 정보 조회
        // results - id, picture, nickname, age, job, level
        // + 달력정보, 스트레칭 횟수, 거북이 메시지
        let userInfo = req.user;
        let today = moment();
        let yyyy = today.format('YYYY');
        let mm = today.format('MM');
        let dd = today.format('DD');
        //  console.log(dd)
        let userHistoryCalendar = await models.UserHistory.findAll({
            where: {
                userId: userInfo.id,
                yyyy: yyyy,
                mm: mm
            },
            attributes: ['dd']
        });
        let userHistoryArray = [];
        for (let index = 0; index < userHistoryCalendar.length; index++) {
            userHistoryArray.push(userHistoryCalendar[index].dataValues.dd)
            
        }
        let userHistory = await models.UserHistory.findOrCreate({
            where: {
                userId: userInfo.id,
                yyyy: yyyy,
                mm: mm,
                dd: dd
            },
            defaults: {
                userId: userInfo.id,
                yyyy: yyyy,
                mm: mm,
                dd: dd
            }
        });
        userInfo.monthTimes = userHistoryCalendar.length;
        userInfo.dd = userHistoryArray;
        userInfo.todayTimes = userHistory[0].dataValues.times;
        res.status(200).json({
            "result": "OK",
            "resultcode": "0",
            "message": "사용자 정보 조회",
            "results": userInfo
        });
        return;
    } catch (error) {
        errors(res, error, "유저");
        return;
    };
};
