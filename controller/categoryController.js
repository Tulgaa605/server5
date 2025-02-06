const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

exports.getCategories = async (req, res) => {
  const {id, name} = req.query;
  const {id: paramId, name: paramName} = req.params;

  try {
    const whereCondition = {};
    if ((id || name) && paramId && paramName) {
      whereCondition.OR = [{id: Number(paramId)}, {name: paramName}];
    } else if (id && name) {
      whereCondition.OR = [{name: name}, {id: Number(id)}];
    } else if (id) {
      whereCondition.id = Number(id);
    } else if (name) {
      whereCondition.name = name;
    } else if (paramId && paramName) {
      whereCondition.id = Number(paramId);
      whereCondition.name = paramName;
    } else if (paramId) {
      whereCondition.id = Number(paramId);
    } else if (paramName) {
      whereCondition.name = paramName;
    }

    const categories = await prisma.category.findMany({
      where: whereCondition,
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({error: "Server error"});
  }
};

exports.createCategory = async (req, res) => {
  const {name} = req.body;
  try {
    const category = await prisma.category.create({
      data: {name},
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({error: "Server error",error});
  }
};

exports.updateCategory = async (req, res) => {
  const {identifier} = req.params;
  const {name: newName} = req.body;

  try {
    let updatedCategory;
    if (!isNaN(identifier)) {
      updatedCategory = await prisma.category.update({
        where: {id: Number(identifier)},
        data: {name: newName},
      });
    } else {
      updatedCategory = await prisma.category.update({
        where: {name: identifier},
        data: {name: newName},
      });
    }

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({error: "Server error"});
  }
};

exports.deleteCategory = async (req, res) => {
  const {identifier} = req.params;

  try {
    let deletedCategory;
    if (!isNaN(identifier)) {
      deletedCategory = await prisma.category.delete({
        where: {id: Number(identifier)},
      });
    } else {
      deletedCategory = await prisma.category.delete({
        where: {name: identifier},
      });
    }

    res.json({message: "Deleted successfully", deletedCategory});
  } catch (error) {
    res.status(500).json({error: "Server error"});
  }
};
