      // MODEL SECTION
      let todos;
      let savedTodos = JSON.parse(localStorage.getItem('todos'));
      
      if (Array.isArray(savedTodos)) {
        todos = savedTodos;
      }
      else {
        todos = [{
          title: 'get groceries',
          dueDate: '2022-09-01',
          id: 'id1',
          isDone: false,
          editMode: false
        }, {
          title: 'wash car',
          dueDate: '2022-09-02',
          id: 'id2',
          isDone: false,
          editMode: false
        }, {
          title: 'make dinner',
          dueDate: '2022-09-03',
          id: 'id3',
          isDone: false,
          editMode: false
        }, {
          title: 'do laundry',
          dueDate: '2022-09-04',
          id: 'id4',
          isDone: false,
          editMode: false
        }];
      }

      // Creates a todo
      const createTodo = (title, dueDate) => {
        const id = '' + new Date().getTime();        
        todos.push({
          title: title,
          dueDate: dueDate,
          id: id,
          isDone: false,
          editMode: false
        });
        saveTodo();
      }
      // Deletes a todo
      const removeTodo = idToDelete => {
        todos = todos.filter(todo => {
          return todo.id !== idToDelete;
        });
        saveTodo();
      }
      // Saves a todo
      const saveTodo = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
      }
      // Toggles a todo
      const toggleTodo = (id, status) => {
        todos.forEach (todo => {
          if (todo.id === id) {
            todo.isDone = status;
          }
        });
        saveTodo();
      }
      // Changes a todo
      const changeTodo = (idToChange, textToChange, dateToChange) => {
        todos.forEach (todo => {
          if (todo.id === idToChange){
            if (textToChange !== '') {
              todo.title = textToChange;
            }
            if (dateToChange !== '') {
              todo.dueDate = dateToChange;
            }
            todo.editMode = false;
          }            
        });
        saveTodo();
      }      
      // Put a todo in an edit mode
      const toEditMode = idToEdit => {
        todos.forEach (todo => {
          if (todo.id === idToEdit)
            todo.editMode = true;
        });        
      }

      // Sorts todos in descending order
      const sortDesc = () => {
        for (let i = 1; i < todos.length; i++) {
          let object = todos[i];
          let k = i;
          for (let j = i-1; j >= 0; j--) {
            if (object.dueDate > todos[j].dueDate) {
              todos[k] = todos[j];
              todos[j] = object;
              k--;
            } else {
              break;
            }
          }
        }
      }

      // Sorts in ascending order
      const sortAsc = () => {
        for (let i = 1; i < todos.length; i++) {
          let object = todos[i];
          let k = i;
          for (let j = i-1; j >= 0; j--) {
            if (object.dueDate < todos[j].dueDate) {
              todos[k] = todos[j];
              todos[j] = object;
              k--;
            } else {
              break;
            }
          }
        }
      }

      // VIEW SECTION
			const addElement = () => {
				// reset our todo-list	
        document.getElementById('todo-list').innerHTML ='';
        
				todos.forEach (todo => {
          const element = document.createElement('div');
          element.className = 'task';

          // renders in normal mode
          if (todo.editMode === false) {

            const text = document.createElement('div');            
            if (todo.title === '' || todo.title === '(no title)') {
                todo.title = '(no title)';
                text.className = 'no-title';  
            } else {
                text.className = 'title';
              }            
            text.innerText = todo.title;
            element.appendChild(text);

            const date = document.createElement('div');
            if (todo.dueDate === '' || todo.dueDate === '(no date)') {
                todo.dueDate = '(no date)';
                date.className = 'no-date';  
            } else {
                date.className = 'date';
              }            
            date.innerText = todo.dueDate;
            element.appendChild(date);
           

            const coverCheckbox = document.createElement('div');
            coverCheckbox.className = 'coverBox';
            element.prepend(coverCheckbox);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'checkbox';
            checkbox.id = todo.id;  
            checkbox.onchange = checkTodo;
            if (todo.isDone === true) 
              checkbox.checked = true;
            else 
              checkbox.checked = false;          
            element.prepend(checkbox);

            const editButton = document.createElement('button');
            editButton.innerHTML = '&#9998;';
            editButton.className = 'edit-button';
            editButton.onclick = editTodo(todo);
            element.append(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.innerText = '\u00D7';
            deleteButton.className = 'delete-button';
            deleteButton.onclick = deleteTodo(todo);          
            element.append(deleteButton);
          }
          // renders in edit mode
          else {
            const editTextbox = document.createElement('input');
            editTextbox.value = todo.title;
            editTextbox.onsubmit = updateEnter();
            editTextbox.className = 'edit-todo';
            editTextbox.id = 'edit-text-' + todo.id;
            element.append(editTextbox);
            
            const datePicker = document.createElement('input');
            datePicker.type = 'date';
            datePicker.className = 'edit-date';
            datePicker.value = todo.dueDate;
            datePicker.id = 'edit-date-' + todo.id;          
            element.append(datePicker);

            const updateButton = document.createElement('button');
            updateButton.innerText = 'Update';
            updateButton.className = 'update-button';
            updateButton.dataset.id = todo.id;
            updateButton.onclick = updateTodo;
            element.append(updateButton);

            const editPencil = document.createElement('div');
            editPencil.innerHTML = '&#9998;';
            editPencil.className = 'edit-pencil';
            element.prepend(editPencil);
          }

          const todoList = document.getElementById('todo-list');
          todoList.appendChild(element);          
			  });

        if (todos.length !== 0) {
          sortButtons();
        }
			}

      const clearInput = () => {
        const textbox = document.getElementById('todo-title');
				textbox.value = '';

        const datePicker = document.getElementById('date-picker');
        datePicker.value = '';
      }

      const sortButtons = () => {
        const sortButtonArea = document.createElement('div');
        sortButtonArea.className = 'sort-buttons';

        const upArrow = document.createElement('button');
        upArrow.className = 'up-arrow';
        upArrow.innerHTML = '&#8593';
        upArrow.onclick = sortDateAsc;

        const downArrow = document.createElement('button');
        downArrow.className = 'down-arrow';
        downArrow.innerHTML = '&#8595';
        downArrow.onclick = sortDateDesc;

        sortButtonArea.appendChild(downArrow);
        sortButtonArea.appendChild(upArrow);        
        
        const todoList = document.getElementById('todo-list');
        todoList.prepend(sortButtonArea);
      }

      // CONTROLLER SECTION
			const addTodo = () => {
				const textbox = document.getElementById('todo-title');
        const title = textbox.value;
        				
        const datePicker = document.getElementById('date-picker');
        const dueDate = datePicker.value;

        createTodo(title, dueDate);
				addElement();
        clearInput();
			}

      // the example of closure
      const deleteTodo = todoToDelete => {
        return () => {
          removeTodo(todoToDelete.id);
          addElement();
        } 
      }

      const checkTodo = event => {
        const checkbox = event.target;
        const idToCheck = checkbox.id;
        const checkedStatus = checkbox.checked;

        toggleTodo(idToCheck, checkedStatus);
        addElement();
      }

      const editTodo = todoToEdit => {
        return () => {
          toEditMode(todoToEdit.id);
          addElement();
        }
      }

      const updateTodo = event => {
        const updateButton = event.target;
        const idToUpdate = updateButton.dataset.id;
        
        const textbox = document.getElementById('edit-text-' + idToUpdate);
        const textToUpdate = textbox.value;

        const datePicker = document.getElementById('edit-date-' + idToUpdate);
        const dateToUpdate = datePicker.value;
        
        changeTodo(idToUpdate, textToUpdate, dateToUpdate);
        addElement();        
      }

      const updateEnter = event => {
        console.log('hello');
        // const textbox = event.target;
        // const idToUpdate = textbox.id;
        // const textToUpdate = textbox.value;

        // const datePicker = document.getElementById('edit-date-' + idToUpdate);
        // const dateToUpdate = datePicker.value;
        
        // changeTodo(idToUpdate, textToUpdate, dateToUpdate);
        // addElement();
      }

      const sortDateAsc = () => {        
          sortAsc();
          addElement();        
      }

      const sortDateDesc = () => {        
          sortDesc();
          addElement();        
      }

      // Main code
      window.onload = addElement();