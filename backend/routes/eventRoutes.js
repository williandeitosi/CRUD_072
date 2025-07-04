import { Router } from "express";
import {
  createEventHandler,
  deleteEventHandler,
  listEventsHandler,
  updateEventHandler,
} from "../controllers/eventController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /events:
 *   post:
 *     tags:
 *       - events
 *     summary: Cria um novo evento
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *       400:
 *         description: Falha na validação
 */
router.post("/", authenticateToken, createEventHandler);

/**
 * @swagger
 * /events/all:
 *   get:
 *     tags:
 *       - events
 *     summary: Lista todos os eventos do usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos retornada
 *       401:
 *         description: Não autorizado
 */
router.get("/all", authenticateToken, listEventsHandler);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     tags:
 *       - events
 *     summary: Atualiza um evento existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Evento atualizado
 *       404:
 *         description: Evento não encontrado
 */
router.put("/:id", authenticateToken, updateEventHandler);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     tags:
 *       - events
 *     summary: Remove um evento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evento removido
 *       404:
 *         description: Evento não encontrado
 */
router.delete("/:id", authenticateToken, deleteEventHandler);

export default router;
