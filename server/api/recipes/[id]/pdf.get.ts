import PDFDocument from "pdfkit";
import { Unit } from "~/shared/models/Unit";
import { Recipe } from "~~/server/models/Recipe";

const toTitle = (value: string) => {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
};

function safeFilename(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s.-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

const recipeToPdfBuffer = (recipe: {
  title: string;
  description: string;
  tips?: string;
  category: string;
  defaultNbPeople: number;
  ingredients: Array<{ quantity: number; unit: Unit; name: string }>;
  steps: string[];
}) => {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(22).text(toTitle(recipe.title));
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Catégorie: ${recipe.category}`);
    doc.text(`Pour ${recipe.defaultNbPeople} personne(s).`);
    doc.moveDown();

    doc.fontSize(16).text("Description");
    doc.fontSize(12).text(recipe.description);
    doc.moveDown();

    if (recipe.tips) {
      doc.fontSize(16).text("Conseils");
      doc.fontSize(12).text(recipe.tips);
      doc.moveDown();
    }

    doc.fontSize(16).text('Ingredients')
    doc.fontSize(12)
    recipe.ingredients.forEach((i) => {
      const unitLabel = i.unit === Unit.NONE ? "" : `${i.unit}`
      doc.text(`- ${i.quantity}${unitLabel} ${i.name}`)
    })
    doc.moveDown()

    doc.fontSize(16).text('Étapes')
    doc.fontSize(12);
    recipe.steps.forEach((step, idx) => {
      doc.text(`${idx + 1}. ${step}`)
      doc.moveDown(0.25)
    });

    doc.end()
  });
};

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Id de recette invalide.",
    });
  }

  const recipe = await Recipe.findById(id).lean();

  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: `Aucune recette n’existe pour id: ${id}!`,
    });
  }

  const buffer = await recipeToPdfBuffer({
    title: recipe.title,
    description: recipe.description,
    tips: recipe.tips,
    category: recipe.category,
    defaultNbPeople: recipe.defaultNbPeople,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
  });

  const filename = `${safeFilename(recipe.title || "recette")}.pdf`;

  setHeader(event, "Content-Type", "application/pdf");
  setHeader(event, "Content-Disposition", `attachment; filename="${filename}"`);
  setHeader(event, "Content-Length", (buffer.length));
  setHeader(event, "Cache-Control", "no-store");

  return buffer;
});
