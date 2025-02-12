import { Schema, Document } from 'mongoose';
import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export class Helpers {
  static async autopopulatePlugin(schema: Schema) {
    // 1. Obtener todos los paths con autopopulate
    const autopopulatePaths: string[] = [];
    schema.eachPath((pathName, path) => {
      let options;
      if (Array.isArray(path.options.type)) options = path.options.type[0];
      else options = path.options;
      if (options?.autopopulate) {
        autopopulatePaths.push(pathName);
      }
    });

    if (autopopulatePaths.length === 0) return;

    // 2. Crear opciones de populate
    const populateOptions = autopopulatePaths.map((path) => ({ path }));

    // 3. Middleware para operaciones find
    const findHooks: RegExp[] = [/find/, /findOne/, /findById/];

    findHooks.forEach((hookName) => {
      schema.post(hookName, async (docs: Document | Document[], next: any) => {
        try {
          const documents = Array.isArray(docs) ? docs : [docs];

          await Promise.all(
            documents.map(async (doc) => await doc?.populate(populateOptions)),
          );

          next();
        } catch (error) {
          next(error as Error);
        }
      });
    });

    // 4. Middleware para operaciones de actualización
    schema.post('findOneAndUpdate', async function (doc: Document, next: any) {
      try {
        if (doc) {
          await doc.populate(populateOptions);
        }
        next();
      } catch (error) {
        next(error as Error);
      }
    });

    // 5. Middleware para operaciones de creación
    schema.post('save', async function (doc: Document, next: any) {
      try {
        await doc.populate(populateOptions);
        next();
      } catch (error) {
        next(error as Error);
      }
    });
  }

  static generateShareToken(useUUID?: boolean) {
    if (useUUID) return uuidv4();
    return randomBytes(32).toString('hex'); // 64 caracteres, seguro
  }
}
