# Руководство по созданию пакетов для [Meteor](https://www.meteor.com/)

В данном руководстве будет рассмотрено несколько примеров пакетов для Meteor и некоторые особенности этих пакетов.

## Перед началом

Если вы планируете публиковать свои пакеты для общественного доступа, необходимо завести аккаунт разработчик. Сделать это можно на сайте [Meteor](https://www.meteor.com/). В верхнем левом углу есть форма для регистрации. После регистрации необходимо войти в систему на вашем компьютере, выполнив команду

    $ meteor login

Имя пакетов имеет следующую структуру: `username:packagename` - где `username` - имя пользователя и если вы являетесь контрибьютором этого пакета, то `username` должен совпадать с именем пользователя, указанного при регистрации. В противном случае вам не удастся опубликовать пакет*.

Для быстрого создания каркаса вашего пакета можно воспользоваться командой

    $ meteor create --package <package name>

Выполним эту команду и посмотрим что в итоге получилось:

    $ meteor create --package hello
    hello: created

В текущей папке был создан проект с именем `hello` (у меня имя не правильное и его не получится опубликовать, но я и не собираюсь). В самом проекте сейчас содержится три файла: `hello.js`, `hello-tests.js`, `package.js`. Пока что перые два файла особого интереса не представляют, давайте лучше ознакомимся с `package.js`.

## package.js

Данный файл состоит из трех основных секций: описание пакета, секция сборки и секция тестирования. Опционально в этом же файле можно управлять npm зависимостями. Содержание файла выглядит следующим образом

```javascript
/*
  Общая информация о пакете
*/
Package.describe({
  // версия пакета согласно http://semver.org/
  version: "1.0.0",
  // короткое описание проекта
  summary: "What this does",
  // имя пакета, по умолчанию именем является
  // названием директории содержащей пакет
  name: "hello",
  // ссылка до исходников проекта на github
  git: "https://github.com/something/something.git"
});

/*
  Данная секция определяет ваш пакет, здесь указываются параметры сборки,
  зависимости, экспорт и прочее
*/
Package.onUse(function(api) {
  // версии пакетов ядра берутся из указанной версии
  api.versionsFrom('METEOR-CORE@0.9.0');
  // зависимости
  api.use('underscore');
  api.use('mrt:jquery-ui@1.9.2', 'client');
  // доступ пользователю к зависимым пакетам
  api.imply('mrt:jquery-ui');
  // Подключение файлов проекта
  api.addFiles('hello.js', 'server');
  // Экспорт объектов пакета
  api.export('Hello', 'server');
});

/* Информация для тестирования пакета */
Package.onTest(function(api) {
  // подключение библиотеки tinytest
  api.use('tinytest');
  // подключение текущего пакета
  api.use('hello');
  // добавление файлов тестов
  api.addFiles('hello-tests.js');
});

/* Здесь можно указать npm зависимости */
Npm.depends({
  "async": "0.9.0"
});
```

#### Package.describe

С помощью функции `Package.describe(options)` вы можете предоставить основную информацию о пакете. В объект `options` обязательным параметром является только `version`, и дополнительно можно указать имя пакета, короткое описание и ссылку на репозиторий в github.

* `version` - версия пакета согласно спецификации [Semantic Versioning](http://semver.org/), обязательный параметр, при публикации новой версии этот параметр должен инкриминироваться
* `summary` - короткое описание пакета, буквально в двух словах, оно будет отображаться при поиске пакета
* `name` - имя пакета, по умолчанию используется название директории в котором содержится пакет, имя пакета должно иметь следующий формат `username:packagename`
* `git` - ссылка на github репозиторий


#### Package.onUse

В метод `Package.onUse` должна передаваться функция, которая будет определять зависимости проекта, файлы проекта, экспорт и доступ пользователя к зависимостям.

* `api.use(<packagename[@version]>, [architecture], {options})` - добавление в проект зависимости `packagename`
  * `[@version]` - вы можете указать версию зависимости, например если вы укажите `application-configuration@1.0.0` для использования, то будет использоваться пакет версии `1.0.0` или выше, но совместимый с этим релизом
  * `[architecture]` - если вы хотите что бы зависимый пакет использовался только на сервере или клиенте, то в качестве этого параметра укажите `server` или `client` соответственно, если не казать данный параметр, то зависимость будет доступна в обоих средах
  * `options`
    * `weak` - флаг устанавливающий слабую зависимость. Если этот флаг установлен, то указанный пакет не будет загружен в проект, при условии, что больше он нигде не указан (в зависимостях других пакетов или в самом проекте)
    * `unordered` - если флаг установлен, то ваш пакет может быть загружен в проект раньше, чем указанная зависимость
* `api.versionsFrom(<meteorversion>)` - использование версий пакетов ядра из указанного релиза. По умолчанию версии берутся из текущей версии Meteor на проекте.
* `api.imply(<packagename> | [<packagename1>, <packagename2>)` - передав в эту функцию имя пакета или массив с именами, вы можете предоставить доступ пользователя к зависимым пакетам
* `api.export(exportedObject, [architecture])` - объекта, первым параметром передается имя экспортируемого объекта. Например если у вас в пакете есть глобальный объект `MyCoolObject` с определенной функциональность, и вы хотите предоставить доступ к нему из пользовательского приложения, то просто используйте этот метод, все остальные объекты экспортироваться не будут. Также вы можете ограничить область видимости этого пакета передав параметр `architecture`, который может принимать значения `client`, `server`
* `api.addFiles(<filename> | [<filename1>, <filename2>], [architecture])` - добавление файла или массива файлов к пакету, файлы загружаются в проект в порядке соответствующем вызовам данного метода.


#### Package.onTest

Секция определяющая тесты для пакета. Метод похож на `Package.onUse`, только вы можете подключить свой пакет к тестам воспользовавшись методом `api.use` и передав туда параметром имя вашего пакета, все зависимости при этом будут подключены автоматически. Для тестирования обычно используют библиотеку `tinytest`, но вы можете воспользоваться любым функционалом.


#### Npm.depends

Чтобы подключить к проекту npm зависимости, можно передать в этот метод объект, где ключом является имя пакета, а значением его версия. Для подключения библиотеки в проект, нужно воспользоваться функцией `Npm.require`, куда передается имя пакета, а возвращается библиотека, работает как `require` в `nodejs`.


## Тестирование пакета

Есть два основных пути для тестирования пакета


#### Интеграционные тесты

Вы можете создать Meteor приложение и в папку `pakages` перенести свой пакет (достаточно, кстати, просто создать символьную ссылку на пакет), а после воспользоваться командо

    $ meteor add <package name>

где `<package name>` имя директории с пакетом. После этого ваш пакет будет доступен в проекте и вы можете отладить его и написать интеграционные тесты.


#### Модульное тестирование

Это выполнение тестов описанных в файле `package.js` в секции `onTest`. Для запуска тестов нужно воспользоваться командой

    $ meteor test-packages <package name>

Вместо имени пакета можно передать путь до него, например для запуска тестов из папки с пакетом достаточно запустить `meteor test-packages ./`.


## Примеры

В папках к данному проекту собранно несколько пакетов, в близжайшее вермя постараюсь добавить к ним описание.
