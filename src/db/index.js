import firestoreDb from "./fireStoreInit.js";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Database access class
 */
export default class Db {
  constructor() {
    this.db = firestoreDb; // единственный экземпляр
  }
  /**
   * Добавляет пользователя в чат
   * @param {string|number} chatId
   * @param {ChatMember} data
   * @returns {Promise<boolean>} true, если запись успешна, false при ошибке
   */

  async addOrUpdateUserInChat(chatId, data) {
    try {
            const {
          id,
          tg_username = "",
          tg_nickname = "",
          pull_ups = 0,
          push_ups = 0,
          sit_ups = 0,
          crunches = 0,
          exp = 0,
        } = data;

      const ref = this.db
        .collection("fizacher_chats")
        .doc(String(chatId))
        .collection("members")
        .doc(String(data.id));

        const snap = await ref.get();

      await ref.set(
        {
          id: id,
          tg_username: tg_username ,
          tg_nickname: tg_nickname ,
          push_ups: FieldValue.increment(push_ups || 0),
          pull_ups: FieldValue.increment(pull_ups || 0),
          sit_ups: FieldValue.increment(sit_ups || 0),
          crunches: FieldValue.increment(crunches || 0),
          exp: FieldValue.increment(exp || 0),
          last_update: FieldValue.serverTimestamp(),
          joined_at: snap.exists? snap.data().joined_at : FieldValue.serverTimestamp(), // Firestore не перезапишет, если уже есть
        },
        { merge: true }
      );
      return true;
    } catch (error) {
      console.error("Ошибка добавления|update пользователя:", error);
      return false;
    }
  }



  /**
   *
   * @param {string|number} chatId
   * @param {{id:number,chat_name:string,exp:number,level:number, chat_type:string}} chatData
   */
  // TODO добавить обновление данных чата при изменении имени и тп
  async createOrUpdateChat(chatId, chatData) {
    try {

        const ref = this.db.collection("fizacher_chats")
        .doc(String(chatId))
      const snap = await ref.get();

         await ref
        .set(
          {
            ...chatData,
            updated_at: FieldValue.serverTimestamp(),
            created_at: snap.exists? snap.data().created_at : FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

      return true;
    } catch (err) {
      console.error("Ошибка создания/обновления чата:", err);
      return false;
    }
  }

  /**
   *
   * @param {string|number} chatId
   * @param {string|number} userId
   * @returns  {ChatMember|null} Promise<ChatMembert|null>
   */
  async getUser(chatId, userId) {
    const snap = await this.db
      .collection("fizacher_chats")
      .doc(String(chatId))
      .collection("members")

      .doc(String(userId))
      .get();
    return snap.exists ? snap.data() : null;
  }

  /**
   * Returns all member documents for a given chat.
   *
   * @param {string|number} chatId - ID of the chat.
   * @returns {[ChatMember]}Promise<Array<Object>> - Array of chat member objects.
   */
  async getChatMembers(chatId) {
    const snap = await this.db
      .collection("fizacher_chats")
      .doc(String(chatId))
      .collection("members")
      .get();

    const members = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return members;
  }

  /**
   * Add exercise count to a user in a chat.
   *
   * @param {string|number} chatId - Chat ID
   * @param {string|number} userId - Telegram user ID
   * @param {"push_ups"|"pull_ups"|"sit_ups"|"crunches"} field - Exercise field to increment
   * @param {number} count - Number of repetitions
   * @returns {Promise<void>}
   */
  async addExercise(chatId, chatMember, field, count) {
    try {
      
      const xpRates = {
        push_ups: 1,
        pull_ups: 1.5,
        sit_ups: 1.2,
        crunches: 0.5,
      };


      return this.addOrUpdateUserInChat(chatId,{
        ...chatMember,
        exp:xpRates[field]*count,
        [field]:count
      });
    } catch (error) {
      console.error("Ошибка добавления упражнения:", error);
      return false;
    }
  }



}
