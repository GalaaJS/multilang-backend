const { ErrorHandler } = require('../../../middleware/error');
const { Language } = require('../../../database/models');

// list
exports.select = async (req, res, next) => {
  try {
    const langs = await Language.findAll();
    res.success(langs);
  } catch (err) {
    next(err);
  }
};

// insert
exports.insert = async (req, res, next) => {
  const data = req.body;
  try {
    const lang = await Language.create(data);
    res.success(lang);
  } catch (err) {
    next(err);
  }
};

// update
exports.update = async (req, res, next) => {
  const data = req.body;
  try {
    const lang = await Language.update(data, {
      where: { lang_id: req.params.id },
    });
    res.success(lang);
  } catch (err) {
    next(err);
  }
};

// delete
exports.delete = async (req, res, next) => {
  try {
    await Language.destroy({
      where: { lang_id: req.params.id },
    });
    res.success();
  } catch (err) {
    next(err);
  }
};

// detail
exports.detail = async (req, res, next) => {
  try {
    const lang = await Language.findOne({
      where: { lang_id: req.params.id },
    });
    if (!lang) {
      throw new ErrorHandler(404, 'Data not found');
    }
    res.success(lang);
  } catch (err) {
    next(err);
  }
};
