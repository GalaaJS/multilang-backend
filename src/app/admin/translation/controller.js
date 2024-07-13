const { ErrorHandler } = require('../../../middleware/error');
const { Translation, Language } = require('../../../database/models');

// list
exports.select = async (req, res, next) => {
  try {
    const list = await Translation.findAll({
      include: [
        {
          model: Language,
          required: false,
        },
      ],
    });
    const result = list.map((translation) => {
      return {
        translation_id: translation.translation_id,
        lang_id: translation.lang_id,
        key: translation.key,
        value: translation.value,
        status: translation.status,
        created_at: translation.created_at,
        updated_at: translation.updated_at,
        lang_code: translation.Language?.lang_code,
        lang_name: translation.Language?.lang_name,
      };
    });
    res.success(result);
  } catch (err) {
    next(err);
  }
};

// insert
exports.insert = async (req, res, next) => {
  const data = req.body;
  try {
    const d = await Translation.create(data);
    res.success(d);
  } catch (err) {
    next(err);
  }
};

// update
exports.update = async (req, res, next) => {
  const data = req.body;
  try {
    const d = await Translation.update(data, {
      where: { translation_id: req.params.id },
    });
    res.success(d);
  } catch (err) {
    next(err);
  }
};

// delete
exports.delete = async (req, res, next) => {
  try {
    // await Translation.destroy({
    //   where: { translation_id: req.params.id },
    // });
    await Translation.update(
      { status: 'deleted' },
      {
        where: { translation_id: req.params.id },
      }
    );
    res.success();
  } catch (err) {
    next(err);
  }
};

// detail
exports.detail = async (req, res, next) => {
  try {
    const d = await Translation.findOne({
      where: { translation_id: req.params.id },
    });
    if (!d) {
      throw new ErrorHandler(404, 'Data not found');
    }
    res.success(d);
  } catch (err) {
    next(err);
  }
};
