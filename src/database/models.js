const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('multilang', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres',
});

const Project = sequelize.define(
  'Project',
  {
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: 'projects',
    timestamps: false,
  }
);

const Language = sequelize.define(
  'Language',
  {
    lang_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lang_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    lang_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: 'languages',
    timestamps: false,
  }
);

const ProjectLanguage = sequelize.define(
  'ProjectLanguage',
  {
    project_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Project,
        key: 'project_id',
      },
    },
    lang_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Language,
        key: 'lang_id',
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: 'project_languages',
    timestamps: false,
  }
);

const Translation = sequelize.define(
  'Translation',
  {
    translation_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lang_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Language,
        key: 'lang_id',
      },
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'deleted'),
      defaultValue: 'active',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: 'translations',
    timestamps: false,
  }
);

const Url = sequelize.define(
  'Url',
  {
    url_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Project,
        key: 'project_id',
      },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: 'urls',
    timestamps: false,
  }
);

const TranslationUrl = sequelize.define(
  'TranslationUrl',
  {
    translation_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Translation,
        key: 'translation_id',
      },
    },
    url_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Url,
        key: 'url_id',
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: 'translation_urls',
    timestamps: false,
  }
);

// Define associations
Project.belongsToMany(Language, {
  through: ProjectLanguage,
  foreignKey: 'project_id',
});
Language.belongsToMany(Project, {
  through: ProjectLanguage,
  foreignKey: 'lang_id',
});
Language.hasMany(Translation, { foreignKey: 'lang_id' });
Translation.belongsTo(Language, { foreignKey: 'lang_id' });
Translation.belongsToMany(Url, {
  through: TranslationUrl,
  foreignKey: 'translation_id',
});
Url.belongsToMany(Translation, {
  through: TranslationUrl,
  foreignKey: 'url_id',
});
Url.belongsTo(Project, { foreignKey: 'project_id' });

module.exports = {
  Project,
  Language,
  ProjectLanguage,
  Translation,
  Url,
  TranslationUrl,
  sequelize,
};
