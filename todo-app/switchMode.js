// функция смены режима использования хранилища (серверное или локальное)
export function switchMode () {
  // выбираем элемент
  let switchBtn = document.getElementById('switch-btn')
  // записываем переменную проверки режима (изначально будет null), можно задать изначальное значение например localStorage
  let checkMode = sessionStorage.getItem("myKey")
  // в зависимости от ее значения разная надпись на кнопке , в случае else  - по умолчанию (даже если переменна null изначально)
  if (checkMode === 'server') {
    switchBtn.textContent= 'Перейти на локальное хранилище'
  } else {
    switchBtn.textContent= 'Перейти на серверное хранилище'
  }
  // функция события клика - записываем переменную и ее значение в sessionStorage, затем мы ее будем получать в переменную checkMode
  switchBtn.addEventListener('click', function() {
    if (switchBtn.textContent === 'Перейти на серверное хранилище') {
        sessionStorage.setItem('myKey', 'server');
        location.reload();
      } else {
        sessionStorage.setItem('myKey', 'localStorage');
        location.reload();
      }
    });
  return checkMode;
}
