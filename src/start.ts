import { Application } from 'express';
import { CONFIG } from '#config';
import { prisma } from '#/providers';
import { AuthService } from '#/services';

const createAdmin = async () => {
  const email = CONFIG.APP_BASE_ADMIN_EMAIL;

  const admin = await prisma.user.findUnique({
    where: { email }
  });

  if (!admin) {
    const hashPassword = await AuthService.makeHashPassword({
      password: CONFIG.APP_BASE_ADMIN_PASSWORD
    });
    await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        credits: 10000,
        role: 'admin'
      }
    });
  } else {
    await prisma.user.update({
      where: { id: admin.id },
      data: { role: 'admin', credits: 10000 }
    });
  }
};

export const start = async (app: Application) => {
  try {
    await prisma.$connect();

    await createAdmin();

    app.listen(CONFIG.APP_PORT, () => {
      console.info(`Server start on PORT: ${CONFIG.APP_PORT}`);
    });
  } catch (error) {
    console.error('Server start with error: ', error);
  }
};
