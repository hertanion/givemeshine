# givemeshine

Userbot для VK от [whyrinki](https://vk.com/whyrinki)

## Установка
### 1. Клонируйте репозиторий 
```bash
git clone https://github.com/whyrinki/givemeshine
```
### 2. Перейдите в папку `givemeshine` и установите зависимости 
```bash
npm install
```
#### 2.1 Возможно в будущем будет какая-то проблема со сборкой бота, поэтому дополнительно установите `rollup` и `typescript` глобально
```bash
npm install -g rollup typescript
```
## Настройка
### Создайте в корне проекта файл `shine.settings.json` со следующим содержанием
```jsonc
// shine.settings.json
{
    // Настройки для бота
    "bot": {
        "prefix": "shine", // Префикс: если хотите использовать префикс типа "shine ping" тогда поставьте "prefix_as_name" значение true
        "prefix_as_name": true, // Описано выше
    },
    // Настройки аккаунта
    "account": {
        "name": "shine-account", // Название аккаунта: используется локально
        // Токены
        "token": {
            "full_access": "<token>", // Фулл доступ к аккаунту
            "vk_me": "<token>" // VK Me токен. пока нет функционала с VK Me можно использовать и full_access токен.
        }
    },
    // База данных
    "database": {
        "dialect": "sqlite", // Тип базы. На данный момент доступна база только SQLite. Позже будет поддержка MYSQL.
        "storage": "/storage/givemeshine/shine.data" // SQLite: Путь к базе.
    }
}
```

## Запуск
### Для запуска требуется сначала собрать бота
```bash 
npm run build
```
### После вы можете запустить его одим из нижепредставленных способов
```bash

# напрямую
node ./build/shine.js

# через скрипт
npm run start

# в фон через pm2
pm2 start ecosystem.config.js
```

## Лицензия
### Код в этом репозитории лицензирован под GNU GPL v3.
```
Copyright (c) 2021 rinki warehouse, whyrinki

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
```