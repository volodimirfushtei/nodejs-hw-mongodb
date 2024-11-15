import { MyContacts } from '../models/contacts.js'; // Імпортуємо модель contacts

// Функція для отримання всіх контактів
export const getAllContacts = async () => {
  const allContacts = await MyContacts.find(); // Залишаємо contacts (модель) для виконання запиту
  return allContacts; // Повертаємо всі знайдені контакти
};

// Функція для отримання конкретного контакту за ID
export async function getContactById(contactId) {
  try {
    const contact = await MyContacts.findById(contactId); // MongoDB метод для пошуку за ObjectId
    return contact;
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
    throw new Error('Error fetching contact');
  }
}
