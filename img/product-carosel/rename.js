const fs = require('fs');
const path = require('path');

// Путь к папке с картинками (поставьте свой или используйте текущую)
const folderPath = './'; // текущая папка, где лежит скрипт
// или, например: const folderPath = 'C:/Users/User/Pictures';

// Расширения файлов, которые будем обрабатывать (можно добавить свои)
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff'];

// Читаем содержимое папки
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Ошибка чтения папки:', err);
    return;
  }

  // Фильтруем только файлы-картинки
  const images = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext) && fs.statSync(path.join(folderPath, file)).isFile();
  });

  if (images.length === 0) {
    console.log('Картинки с подходящими расширениями не найдены.');
    return;
  }

  console.log(`Найдено ${images.length} изображений. Начинаем переименование...`);

  images.forEach((oldName, index) => {
    const fullOldPath = path.join(folderPath, oldName);

    // Разбиваем имя на части
    const parsed = path.parse(oldName);
    let newBaseName = parsed.name;

    // Удаляем все вхождения "-images" (регистр учитывается)
    newBaseName = newBaseName.replace(/-images/g, '');

    // Если имя не изменилось – пропускаем
    if (newBaseName === parsed.name) {
      console.log(`[${index + 1}] ${oldName} – не содержит "-images"`);
      return;
    }

    const newName = newBaseName + parsed.ext;
    const fullNewPath = path.join(folderPath, newName);

    // Проверка, не существует ли уже файл с новым именем
    if (fs.existsSync(fullNewPath)) {
      console.error(`[${index + 1}] Ошибка: файл "${newName}" уже существует. Пропускаем.`);
      return;
    }

    // Переименовываем
    fs.rename(fullOldPath, fullNewPath, (err) => {
      if (err) {
        console.error(`[${index + 1}] Ошибка при переименовании "${oldName}":`, err);
      } else {
        console.log(`[${index + 1}] "${oldName}" → "${newName}"`);
      }
    });
  });
});