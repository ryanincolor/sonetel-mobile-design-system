import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

interface ComponentSpec {
  name: string;
  content: string;
  lastModified: string;
}

export const handleComponentsList: RequestHandler = (req, res) => {
  try {
    const componentsDir = "./dist/mobile-components";
    const components: ComponentSpec[] = [];

    if (fs.existsSync(componentsDir)) {
      const files = fs.readdirSync(componentsDir);

      files.forEach((file) => {
        if (file.endsWith(".md")) {
          const filePath = path.join(componentsDir, file);
          const content = fs.readFileSync(filePath, "utf8");
          const stats = fs.statSync(filePath);

          components.push({
            name: path.basename(file, ".md"),
            content: content,
            lastModified: stats.mtime.toLocaleDateString(),
          });
        }
      });
    }

    res.json(components);
  } catch (error) {
    console.error("Failed to load components:", error);
    res.status(500).json({ error: "Failed to load components" });
  }
};

export const handleComponentDownload: RequestHandler = (req, res) => {
  try {
    const componentName = req.params.name;
    const filePath = `./dist/mobile-components/${componentName}.md`;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Component not found" });
    }

    const content = fs.readFileSync(filePath, "utf8");

    res.setHeader("Content-Type", "text/markdown");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${componentName}-spec.md"`,
    );
    res.send(content);
  } catch (error) {
    console.error("Failed to download component:", error);
    res.status(500).json({ error: "Failed to download component" });
  }
};
