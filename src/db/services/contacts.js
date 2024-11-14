import { MyContacts } from '../models/contacts.js'; // Імпортуємо модель contacts

// Функція для отримання всіх контактів
export const getAllContacts = async () => {
  const allContacts = await MyContacts.find(); // Залишаємо contacts (модель) для виконання запиту
  return allContacts; // Повертаємо всі знайдені контакти
};

// Функція для отримання конкретного контакту за ID
export const getContactById = async (contactId) => {
  const contact = await MyContacts.findById(contactId); // Знову використовуємо contacts (модель)
  return contact; // Повертаємо знайдений контакт
};
