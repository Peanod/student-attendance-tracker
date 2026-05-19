import jwt from "jsonwebtoken";
import { query } from "../config/db.js";
import { hashPassword, verifyPassword } from "../utils/hashPassword.js";

const roleConfig = [
  {
    role: "admin",
    table: "admin",
    idField: "id_admin",
    nameField: "nama_admin",
  },
  {
    role: "dosen",
    table: "dosen",
    idField: "id_dosen",
    nameField: "nama_dosen",
  },
  {
    role: "mahasiswa",
    table: "mahasiswa",
    idField: "id_mahasiswa",
    nameField: "nama_mahasiswa",
  },
];

export const signToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

export const findUserByEmail = async (email) => {
  for (const config of roleConfig) {
    const result = await query(
      `SELECT ${config.idField} AS id, ${config.nameField} AS nama, email, password
       FROM ${config.table}
       WHERE email = $1
       LIMIT 1`,
      [email],
    );

    if (result.rows[0]) {
      return { ...result.rows[0], role: config.role };
    }
  }

  return null;
};

export const authenticateUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return null;
  }

  const { password: _password, ...safeUser } = user;
  return {
    ...safeUser,
    token: signToken(safeUser),
  };
};

export const getCurrentUser = async ({ id, role }) => {
  const config = roleConfig.find((item) => item.role === role);
  if (!config) {
    return null;
  }

  const result = await query(
    `SELECT ${config.idField} AS id, ${config.nameField} AS nama, email
     FROM ${config.table}
     WHERE ${config.idField} = $1
     LIMIT 1`,
    [id],
  );

  if (!result.rows[0]) {
    return null;
  }

  return { ...result.rows[0], role };
};

export const registerMahasiswa = async ({ nim, nama_mahasiswa, kelas, email, password }) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error = new Error("Email sudah digunakan");
    error.code = "EMAIL_EXISTS";
    throw error;
  }

  const hashedPassword = await hashPassword(password);
  const result = await query(
    `
      INSERT INTO mahasiswa (nim, nama_mahasiswa, kelas, email, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_mahasiswa AS id, nama_mahasiswa AS nama, email
    `,
    [nim, nama_mahasiswa, kelas, email, hashedPassword],
  );

  const user = {
    ...result.rows[0],
    role: "mahasiswa",
  };

  return {
    ...user,
    token: signToken(user),
  };
};
