// Importar Modulos
import Express from "express";
import { engine } from "express-handlebars";
import Morgan from "morgan";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";
import boletaRoutes from "./routes/boleta.routes.js";

// Inicializar Variables
const app = Express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configurar - Settings
app.set("port", process.env.PORT || 3000);
app.set("views", join(__dirname, "views"));
app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    layoutsDir: join(app.get("views"), "layouts"),
    partialsDir: join(app.get("views"), "partials"),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Middlewares
app.use(Morgan("dev"));
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.use(boletaRoutes);

// Public Files
app.use(Express.static(join(__dirname, "public")));

// Correr Servidor
app.listen(app.get("port"), () =>
  console.log("Servidor en el Puerto: ", app.get("port"))
);
