const { ErrorHandler } = require('../../../middleware/error');
const {
  Project,
  ProjectLanguage,
  Language,
} = require('../../../database/models');

// list
exports.select = async (req, res, next) => {
  try {
    const projects = await Project.findAll({
      include: [
        {
          model: Language,
          attributes: ['lang_id', 'lang_code', 'lang_name'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    res.success(projects);
  } catch (err) {
    next(err);
  }
};

// insert
exports.insert = async (req, res, next) => {
  const data = req.body;
  try {
    const project = await Project.create(data);

    if (data.languages && data.languages.length > 0) {
      const projLangs = data.languages.map((r) => {
        return {
          project_id: project.project_id,
          lang_id: r,
        };
      });

      await ProjectLanguage.bulkCreate(projLangs);
    }

    res.success(project);
  } catch (err) {
    next(err);
  }
};

// update
exports.update = async (req, res, next) => {
  const data = req.body;
  try {
    const project = await Project.update(data, {
      where: { project_id: req.params.id },
    });
    if (data.languages && data.languages.length > 0) {
      await ProjectLanguage.destroy({
        where: { project_id: req.params.id },
      });

      const projLangs = data.languages.map((r) => {
        return {
          project_id: req.params.id,
          lang_id: r,
        };
      });

      await ProjectLanguage.bulkCreate(projLangs);
    } else if (data.languages && data.languages.length == 0) {
      await ProjectLanguage.destroy({
        where: { project_id: req.params.id },
      });
    }
    res.success(project);
  } catch (err) {
    next(err);
  }
};

// delete
exports.delete = async (req, res, next) => {
  try {
    await ProjectLanguage.destroy({
      where: { project_id: req.params.id },
    });

    await Project.destroy({
      where: { project_id: req.params.id },
    });
    res.success();
  } catch (err) {
    next(err);
  }
};

// detail
exports.detail = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      include: [
        {
          model: Language,
          attributes: ['lang_id', 'lang_code', 'lang_name'],
          through: {
            attributes: [],
          },
        },
      ],
      where: { project_id: req.params.id },
    });
    if (!project) {
      throw new ErrorHandler(404, 'Data not found');
    }
    res.success(project);
  } catch (err) {
    next(err);
  }
};
