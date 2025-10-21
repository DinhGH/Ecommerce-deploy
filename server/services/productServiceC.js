const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getProducts = async (page, limit) => {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      orderBy: { id: "asc" },
      include: { reviews: true },
    }),
    prisma.product.count(),
  ]);

  return {
    data: products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

const getBrands = async () => {
  const brands = await prisma.product.groupBy({
    by: ["brand"],
    _count: { brand: true },
    orderBy: {
      _count: { brand: "desc" },
    },
    take: 12,
  });
  return brands.map((b) => b.brand);
};

const searchProduct = async (q, page, limit) => {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { brand: { contains: q } },
          { category: { contains: q } },
        ],
      },
      skip: Number(skip),
      take: Number(limit),
    }),
    prisma.product.count({
      where: {
        OR: [
          { title: { contains: q } },
          { brand: { contains: q } },
          { category: { contains: q } },
        ],
      },
    }),
  ]);

  return {
    data: products,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

const filterBrandProduct = async (brand, page, limit) => {
  const skip = (page - 1) * limit;
  if (!brand) {
    throw new Error("Brand is required");
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      where: { brand: { equals: brand } },
    }),
    prisma.product.count({
      where: { brand: { equals: brand } },
    }),
  ]);

  return {
    data: products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

const filterCategoryProduct = async (category, page, limit) => {
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      where: { category: { equals: category } },
    }),
    prisma.product.count({
      where: { category: { equals: category } },
    }),
  ]);

  return {
    data: products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

const getCategories = async () => {
  const categories = await prisma.product.findMany({
    distinct: ["category"],
    select: {
      category: true,
    },
  });
  return categories;
};

const filterAll = async (
  priceRange,
  keyword,
  selectedbrand,
  category,
  sortOrder,
  page,
  limit
) => {
  const skip = (page - 1) * limit;

  const where = {};

  if (category && category !== "All") {
    where.category = { equals: category };
  }

  if (selectedbrand) {
    where.brand = { equals: selectedbrand };
  }

  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { brand: { contains: keyword, mode: "insensitive" } },
      { category: { contains: keyword, mode: "insensitive" } },
    ];
  }

  // Lấy dữ liệu cơ bản (không filter theo priceRange trên DB)
  let products = await prisma.product.findMany({ where });

  // Tính finalPrice = price * (1 - discountPercentage / 100)
  products = products.map((p) => ({
    ...p,
    finalPrice: p.price * (1 - (p.discountPercentage || 0) / 100),
  }));

  // Filter theo priceRange
  if (priceRange && priceRange.length > 0) {
    products = products.filter((p) =>
      priceRange.some((range) => {
        if (range === "500+") return p.finalPrice >= 500;
        const [min, max] = range.split("-").map(Number);
        return p.finalPrice >= min && (max ? p.finalPrice <= max : true);
      })
    );
  }

  // Sort theo finalPrice
  products.sort((a, b) =>
    sortOrder === "desc"
      ? b.finalPrice - a.finalPrice
      : a.finalPrice - b.finalPrice
  );

  const total = products.length;

  // Pagination
  products = products.slice(skip, skip + limit);

  return {
    data: products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

module.exports = {
  getProducts,
  getBrands,
  searchProduct,
  filterBrandProduct,
  getCategories,
  filterCategoryProduct,
  filterAll,
};
