import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const initializeProducts = async () => {
  const products = [
    { name: 'Aceite para Motor', status: 'Disponible', description: 'Aceite sintético de alta calidad para mejorar el rendimiento del motor.', price: '$15 - $25', image: 'https://media.licdn.com/dms/image/v2/D4E12AQEvvrAa5mKR8Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1696884157654?e=2147483647&v=beta&t=VyBL87EHcITjND3nYflH9Q1pnQyC2jV1TiH3JQf-2bI' },
    { name: 'Filtro de Aire', status: 'Nuevo', description: 'Filtro que mantiene el motor limpio y mejora la combustión.', price: '$10 - $20', image: 'https://media.licdn.com/dms/image/v2/D4E12AQEvvrAa5mKR8Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1696884157654?e=2147483647&v=beta&t=VyBL87EHcITjND3nYflH9Q1pnQyC2jV1TiH3JQf-2bI' },
    { name: 'Batería de Auto', status: 'Agotado', description: 'Batería de larga duración para encendido confiable.', price: '$80 - $150', image: 'https://media.licdn.com/dms/image/v2/D4E12AQEvvrAa5mKR8Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1696884157654?e=2147483647&v=beta&t=VyBL87EHcITjND3nYflH9Q1pnQyC2jV1TiH3JQf-2bI' },
    { name: 'Pastillas de Freno', status: 'Disponible', description: 'Pastillas resistentes que garantizan una frenada segura.', price: '$20 - $40', image: 'https://media.licdn.com/dms/image/v2/D4E12AQEvvrAa5mKR8Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1696884157654?e=2147483647&v=beta&t=VyBL87EHcITjND3nYflH9Q1pnQyC2jV1TiH3JQf-2bI' },
    { name: 'Llantas', status: 'Disponible', description: 'Llantas de alta durabilidad para todo tipo de carretera.', price: '$100 - $200', image: 'https://media.licdn.com/dms/image/v2/D4E12AQEvvrAa5mKR8Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1696884157654?e=2147483647&v=beta&t=VyBL87EHcITjND3nYflH9Q1pnQyC2jV1TiH3JQf-2bI' }
  ];

  for (const product of products) {
    await addDoc(collection(db, 'products'), product);
  }
  console.log('Productos inicializados');
};

// Ejecutar una vez
initializeProducts();