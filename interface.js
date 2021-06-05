// Открытие файлов с заданиями

// Объявление массивов, заполняемых в файлах data.99
var db_file = new Array()
var Dano = new Array()

// Вызывается из data.00
function file(file_name, name, comment, max_err, max_time) {
    this.file_name = file_name
    this.name      = name
    this.comment   = comment
    this.max_err   = max_err
    this.max_time  = max_time
}

// Вызывается из !index.htm (head)
function db_open() {

  var NL // N файла в массиве

  // Самый первый запуск или Очистка Cookie
  if (!get_cookie('Best_level')) {
     set_cookie('Best_level', 0, 365)
  }

  // Первый запуск при открытии Проводника
  if (!get_cookie('Level')) {
     set_cookie( 'Level', get_cookie('Best_level') )
  }

  NL = get_cookie("Level")

  document.writeln('<script type="text\/javascript" src="' + db_file[eval(NL)].file_name + '"><\/script>')

} // End function
// ----------------------------------------------------------------------



// Вспомогательные функции для Ввода/Вывода на экран

// Таймер
// Переменные и функции вызываются из dano()
var nTimeStart, nTimeStop


// Сохраняет время начала задания в глобальной переменной
function get_start_time() {

  nTimeStart = new Date()

} // End function


// Сохраняет время окончания задания в глобальной переменной
// Сохраняет продолжительность выполнения задания в cookie-переменной
function get_stop_time() {

  nTimeStop = new Date()

  var nTimeStart_ms  = nTimeStart.getTime()
  var nTimeStop_ms   = nTimeStop.getTime()
  var nDifference_ms = Math.abs(nTimeStop_ms - nTimeStart_ms)
  var sum_old        = eval( get_cookie("Sum_time") )

  set_cookie("Time_otvet", nDifference_ms/1000)

  set_cookie("Sum_time", sum_old + nDifference_ms/1000)

} // End function



function next() {

// Переход на следующий уровень / к следующему заданию
// Вызывается из rezultat()

	var save_BL = eval(get_cookie('Best_level'))

	var NL      = get_cookie('Level')   // N уровня в массиве
	var NZ      = get_cookie('Zadanie') // N задания в массиве
	var N_zadan = eval(NZ) + 1          // Счетчик заданий
	var N_max	= Dano.length
    var NL_max  = db_file.length - 1    // N последнего уровня


    // Если это последнее задание уровня
	if (N_zadan == N_max) {

		// Если соблюдены ограничения по ошибкам и по времени
		if ( get_cookie("Sum_err") <= eval(db_file[NL].max_err)
				&& get_cookie("Sum_time") <= eval(db_file[NL].max_time) ) {

			if (eval(NL) < eval(save_BL)) {   // Уровень уже проходился

				NL++  // уровень следующий от текущего, а не лучший, как
					  // по инициализации при открытии программы

			 } else { // (==) Еще не проходился

				if (eval(NL) < NL_max) {      // Это не последний уровень
					save_BL += 1
					NL++
			 	}
			}
		}

		delete_all_cookies()
		set_cookie("Best_level", save_BL, 365) // Постоянная переменая cookie
		set_cookie("Level", NL)
		set_cookie('Zadanie', 0)

	  } else {

		set_cookie('Zadanie', N_zadan) // + 1
	}

//alert('Start. Level = ' + get_cookie('Level'))
//alert('End. Level = ' + NL)

} // End function



// Сохранение ответа и времени ввода в Cookie
// Время жизни переменных -- только до вывода отчета о прохождении уровня
// Вызывается из vvod()
// Cokie-переменные используются в report()
function save_vvod() {

  var NZ        = get_cookie('Zadanie') // N задания в массиве
  var Name_time = "Time" + NZ           // Имя переменной для сохранения
										// результа текущего задания

  // Если ответ верный
  if ( get_cookie("Vvod") == eval(Dano[NZ]) )  {

     set_cookie( Name_time, get_cookie("Time_otvet") )

    } else {

     set_cookie( Name_time, -get_cookie("Time_otvet") ) // "-" - признак ошибки

	 set_cookie("Sum_err", eval(get_cookie("Sum_err")) + 1)
  }

} // End function



// Отсечение или добаление знаков после "."
function num_razr(num, razr) {

	var num_string = num.toString()
	var punkt      = num_string.indexOf(".")

	if (punkt == -1) {		// Число целое
		num_string += "."
		punkt = num_string.indexOf(".")
	}

	num_string += "000000"

	if (razr > 0) {
	   var end = punkt + 1 + razr
	 } else {
	   var end = punkt
	}

	return num_string.substr(0, end)

} // End function



function NN_write() {

// Номер Уровня и Задания
// Вызывается из dano(), vvod(), rezultat()

	var NL      = eval(get_cookie('Level'))
	var N_zadan = eval(get_cookie('Zadanie')) + 1
	var N_max   = Dano.length


	document.writeln('<p>' + db_file[NL].name + ' Задание ' + N_zadan + ' из ' + N_max + '.')

} // End function



function presently() {

// Возвращает текущие дату и время в виде дд.мм.гггг, чч:мм
// Вызывается из report()

	var Date_now   = new Date() 			  // Взять текущую дату
	var N_Month    = Date_now.getMonth() + 1  // N месяца (Январь - 1, а не 0)
	var Date_write = ""


    // День
	if (Date_now.getDate() > 9) {
		Date_write += Date_now.getDate() + '.'
	 } else {
		Date_write += "0" + Date_now.getDate() + '.'   // 9 --> 09
	}

    // Месяц
	if (N_Month > 9) {
		Date_write += N_Month + '.'
	 } else {
		Date_write += "0" + N_Month + '.'
	}

	// Год
	Date_write += Date_now.getYear() + ", "


    // Часы
	if (Date_now.getHours() > 9) {
		Date_write += Date_now.getHours() + ':'
	 } else {
		Date_write += "0" + Date_now.getHours() + ':'
	}

    // Минуты
	if (Date_now.getMinutes() > 9) {
		Date_write += Date_now.getMinutes()
	 } else {
		Date_write += "0" + Date_now.getMinutes()
	}


	return Date_write

} // End function

// ----------------------------------------------------------------------




// Ввод / Вывод на экран
//
// db_choice()   Выбор открываемого файла с заданиями.
// start_zadan() Не используется! Подготовка рабочего окна.
// dano()        Задание.
// vvod()        Ввод ответа.
// rezultat()    Обработка введенного ответа.
// report()      Отчет о прохождении текущего уровня


// Выбор открываемого файла с заданиями
function db_choice() {

//  var db_file_best = Math.min(db_file.length, eval(get_cookie("Best_level"))+1)
  var db_file_best = eval(get_cookie("Best_level"))+1

//alert("db_file_best = " + db_file_best)

//  var db_file_max = db_file.length

  with(document) {
    writeln('<h1>Программа для тренировки <br>устного счета</h1>')
    writeln('<p>&nbsp;')
    writeln('<form>')
    writeln('  <p>Выберите уровень заданий:')
    writeln('  <p><select name="level_select">')
                for (var i = 0; i < db_file_best; i++) {
    writeln('       <option value="' + i.toString() + '">' + '&nbsp;&nbsp;' + db_file[i].comment + '&nbsp;&nbsp;')
                }
    writeln('     </select>')
    writeln('  <p>&nbsp;')

//    writeln('  <p>Пройдено уровней: ' + (get_cookie("Best_level")+1) + ' из ' + db_file.length + '.')
    writeln('  <p>Доступно уровней: ' + db_file_best + ' из ' + db_file.length + '.')
    writeln('  <p>&nbsp;')

    writeln('  <p><input type="button"')
    writeln('         value="Старт"')
    writeln('         onClick="set_cookie(\'Level\', this.form.level_select.value);')
    writeln('                    set_cookie(\'Mess\', 3);')
    writeln('                    location.reload()">')

    writeln('  &nbsp;<input type="button"')
    writeln('         value="Очистить"')
    writeln('         onClick="if (confirm(\'Удалить данные о пройденных уровнях?\') == true)')
    writeln('                  {delete_all_cookies()}; location.reload()">')

    writeln('  &nbsp;<input type="button"')
    writeln('         value="Выход"')
    writeln('         onClick="window.close()">')
    writeln('</form>')

	writeln('<p>&nbsp;')
	writeln('<p>&nbsp;')
    writeln('<p>&copy; <a href="mailto:yunushev@mail.ru">И. Юнушев</a>, 26.12.2003.')
    close()
  }

  document.forms[0].elements[0].focus()


} // End function



// Не используется!
// Подготовка рабочего окна
function start_zadan() {

  window.resizeTo(400,370)
  window.moveTo(200,100)

  with(document) {
    writeln('<h1 class="Zadanie">Здесь появится задание</h1>')
    writeln('<p>Если необходимо, измените размеры и положение&nbsp;окна...')
    writeln('<form>')
    writeln('  <input type="button"')
    writeln('         value="Старт"')
    writeln('         onClick="set_cookie(\'Mess\', 3);')
    writeln('                 location.reload()">')
    writeln('</form>')
    close()
  }

  document.forms[0].elements[0].focus()

} // End function



// Задание
function dano() {

  NN_write()

  get_start_time()

  with(document) {
    writeln('<h1 class="Zadanie">' + Dano[get_cookie('Zadanie')] + '</h1>')

vvod()


// В index.htm Mess=4 можно не обрабатывать
//    writeln('<form>')
//    writeln(' <input type="button"')
//    writeln('        value="Стоп"')
//    writeln('        onClick="get_stop_time(); set_cookie(\'Mess\', 4);')
//    writeln('                location.reload()">')
//    writeln('</form>')
  }

//  document.forms[0].elements[0].focus()

} // End function



// Ввод ответа
function vvod() {

//  NN_write()

  with(document) {
    writeln('<p>&nbsp;')
    writeln("<p>&nbsp;")
    writeln('<form name="form_name"')
    writeln('      onSubmit="set_cookie(\'Vvod\', form_name.text_name.value);')
    writeln('                get_stop_time(); save_vvod(); set_cookie(\'Mess\', 5);')
    writeln('                location.reload()">')
    writeln('  <p>Введите ответ:')
    writeln('  <p><input type="text" name="text_name">')
    writeln("  <p>&nbsp;")
    writeln("  <p><input type='submit' value='&nbsp;Ввод&nbsp'>")
    writeln("</form>")
  }

  document.forms[0].elements[0].focus()

} // End function




function rezultat() {

// Обработка введенного ответа

  var NL        = get_cookie('Level')   // N уровня в массиве
  var NZ        = get_cookie('Zadanie') // N задания в массиве
  var N_zadan   = eval(NZ) + 1          // Счетчик заданий
  var N_max	    = Dano.length
  var Name_time = "Time" + NZ           // Имя переменной для сохранения
										// результа текущего задания

  NN_write()

  if ( get_cookie("Vvod") == eval(Dano[NZ]) )  {

     document.writeln("<h1 class='Rezultat'>Правильно!</h1>")
     document.writeln("<p>Ответ: " + eval(Dano[NZ]) + ".")

    } else {

     document.writeln("<p><h1 class='Rezultat'>Ошибка.</h1>") 
     document.writeln("<p>Правильный ответ: " + eval(Dano[NZ]) + ".")
  }

  document.writeln("<p>Затраченное время: <b>" + num_razr(get_cookie('Time_otvet'), 2) + "</b> сек.")

  // Контроль ошибок
  if ( eval(db_file[NL].max_err - get_cookie('Sum_err')) >= 0) {

     document.writeln("<p>&nbsp;<p>Осталось ошибок: <b>"   + num_razr(eval(db_file[NL].max_err - get_cookie('Sum_err')), 0) + "</b> из " + db_file[NL].max_err + ".")     

    } else {

     document.writeln("<p>&nbsp;<p>Перерасход ошибок: <b>" + num_razr(Math.abs( eval(db_file[NL].max_err - get_cookie('Sum_err')) ), 0) + "</b>.")
  }

  // Контроль времени
  if ( eval(db_file[NL].max_time - get_cookie('Sum_time')) > 0) {
     document.writeln("<p>Осталось времени: <b>"   + num_razr(eval(db_file[NL].max_time - get_cookie('Sum_time')), 2) + "</b> сек. из " + db_file[NL].max_time + ".")     
    } else {
     document.writeln("<p>Перерасход времени: <b>" + num_razr(Math.abs( eval(db_file[NL].max_time - get_cookie('Sum_time')) ), 2) + "</b> сек.")
  }


  with(document) {
    writeln('<form>')

    // Если последнее задание на этом уровне
    if (N_zadan == N_max) {

	   // Сначала отчет report() - потом изменение счетчиков report() > next()
       writeln('<p><input type="button" value="Отчет"')
       writeln('      onClick="set_cookie(\'Mess\', 6); location.reload()">')

       writeln('&nbsp;<input type="button" value="Выбрать уровень"')
       writeln('      onClick="next(); location.reload()">')

     } else {
       writeln('<p><input type="button" value="Дальше"')
       writeln('      onClick="next(); set_cookie(\'Mess\', 3); location.reload()">')
    }
    writeln('&nbsp;<input type="button" value="Выход"')
    writeln('         onClick="next(); window.close()">')
    writeln('</form>')
  }

  document.forms[0].elements[0].focus()

} // End function




// Отчет о прохождении текущего уровня
// Если отчет не просмотрен сразу, данные удаляются.
function report() {

  var NL        = get_cookie('Level')   // N уровня в массиве
  var N_NL      = eval(NL) + 1          // N уровня в заголовке
  var NZ        = get_cookie('Zadanie') // N задания в массиве
  var N_zadan   = eval(NZ) + 1          // Счетчик заданий
  var N_max	    = Dano.length           // Кол-во заданий в массиве
  var Name_time 			            // Имя переменной для восстановления
										// результа текущего задания
  var Error_out
  var Time_out
  var Presently = presently()			// Текущие дата и время
  var Error_status


with(document) {

  writeln('<p></a>Программа для тренировки устного&nbsp;счета')
  writeln('<p>' + Presently + '.')

  writeln('<h1>ОТЧЕТ<br>о прохождении ' + N_NL + '-го уровня</h1>')

//writeln("<p>" + document.cookie)

  // Контроль ошибок и времени
  if ( get_cookie("Sum_err") <= eval(db_file[NL].max_err)
			&& get_cookie("Sum_time") <= eval(db_file[NL].max_time) ) {
		if (N_NL < db_file.length) {
			Error_status = "Уровень пройден - не последний"
		 } else {
			Error_status = "Уровень пройден - последний"
		}

    } else {
		Error_status = "Уровень не пройден"
  }	 

  // Главный итог словами
  switch (Error_status) {
    case "Уровень пройден - не последний" : 
   	  writeln('<p><b>Уровень пройден!</b>');
      break;
    case "Уровень пройден - последний" :
      writeln('<p><b>Поздравляю!<br>Последний уровень пройден!</b>');
	  break;
    case "Уровень не пройден" :
      writeln('<p><b>Уровень не пройден.</b>');
      break;
  }
  writeln('<p>&nbsp;')

  // Таблица результатов
  writeln('<table width="300" border="1" align="Center" cellspacing="0" cellpadding="8">')
  writeln('<tr> <td class="B">№<br>задания <td class="B">Наличие<br>ошибок <td class="RB">Затраченное<br>время, сек.')

  for (var i = 0; i < N_max; i++) {
		Name_time = "Time" + i
		Error_out = get_cookie(Name_time) < 0 ? 'Ошибка' : '&nbsp;'
		Time_out  = num_razr(Math.abs(get_cookie(Name_time)), 2)

		writeln('<tr> <td>'+(i+1) + '<td>'+Error_out + '<td class="R">'+Time_out )
  } // End for

  writeln( '<tr> <td class="B">Итого <td class="B">'+ (get_cookie("Sum_err") ? get_cookie("Sum_err"): "Нет") + '<td class="RB">'+num_razr(get_cookie('Sum_time'), 2) )
  writeln( '<tr> <td>Норма <td>'+db_file[NL].max_err + '<td  class="R">'+num_razr(db_file[NL].max_time, 2) )
  writeln('</table>')
  writeln('&nbsp;')

  // Кнопка Дальше/Повторить
  switch (Error_status) {
    case "Уровень пройден - не последний" : 
      writeln('<form>');
      writeln('<p><input type="button" value="Дальше"') // Разница только в названии кнопки;
      writeln('      onClick="set_cookie(\'Mess\', 3); location.reload()">');
      break;
    case "Уровень пройден - последний" :
      writeln('<form>');
      writeln('<p>');
      break;
    case "Уровень не пройден" :
      writeln('<form>');
      writeln('<p><input type="button" value="Повторить"');
      writeln('      onClick="set_cookie(\'Mess\', 3); location.reload()">');
      break;
  }

} // End with


  // Изменение счетчиков Level, Zadanie
  next()

  with(document) {
    writeln('&nbsp;<input type="button" value="Выбрать уровень"')
    writeln('      onClick="set_cookie(\'Mess\', 1); location.reload()">')

    writeln('&nbsp;<input type="button" value="Выход"')
    writeln('         onClick="window.close()">')
    writeln('</form>')
    writeln('&nbsp;')
  }

  // Чтобы по ошибке не закрыть отчет
  // document.forms[0].elements[0].focus()

} // End function
