var router = require('express').Router();
const db = require.main.require('./models');
const fs = require('fs');

router.post('/', async (req, res) => {
    let list = await db.List.findOne({
        where: {
            id: req.body.id
        }
    });

    if (list == null || list.createdBy != req.user.id)
        res.json(false);
    
    else {
        let items = await db.Item.findAll({
            where: {
                list: list.id
            }
        });

        for (let item of items) {
            db.SubmissionItem.destroy({
                where: {
                    item: item.id
                }
            });

            let imgPath = './public/itemimg/'+item.id+'.jpg';
            if (fs.existsSync(imgPath))
                fs.unlinkSync(imgPath);
        }

        db.Item.destroy({
            where: {
                list: list.id
            }
        });

        db.Submission.destroy({
            where: {
                list: req.body.id
            }
        });

        db.List.destroy({
            where: {
                id: req.body.id
            }
        });

        res.json(true);
    }
});

module.exports = router;