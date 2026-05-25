import { compile } from '../compile';

// Simulate real browser innerHTML with whitespace/newlines preserved
const template = `
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        autofocus
        autocomplete="off"
        placeholder="What needs to be done?"
        v-model="state.newTodo"
        @keyup="addTodo"
      />
    </header>
    <section
      class="main"
      :style="{display: state.todos.length ? 'block' : 'none'}"
    >
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        v-model="computes.allDone.value"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          v-for="(todo, index) in computes.filteredTodos.value"
          :key="todo.id"
          :class="'todo ' + (todo.completed ? 'completed' : '') + (todo === state.editedTodo ? ' editing' : '')"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label @dblclick="editTodo(todo, index)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input
            class="edit"
            type="text"
            v-model="todo.title"
            @blur="doneEdit(todo)"
            @keyup="onEditKeyup($event, todo)"
          />
        </li>
      </ul>
    </section>
    <footer
      class="footer"
      :style="{display: state.todos.length ? 'block' : 'none'}"
    >
      <span class="todo-count">
        <strong>{{ computes.remaining.value }}</strong>
        <span>{{ computes.remainingText.value }}</span>
      </span>
      <ul class="filters">
        <li>
          <a href="#/all" :class="state.visibility === 'all' ? 'selected' : ''"
            >All</a
          >
        </li>
        <li>
          <a
            href="#/active"
            :class="state.visibility === 'active' ? 'selected' : ''"
            >Active</a
          >
        </li>
        <li>
          <a
            href="#/completed"
            :class="state.visibility === 'completed' ? 'selected' : ''"
            >Completed</a
          >
        </li>
      </ul>

      <button
        class="clear-completed"
        @click="removeCompleted"
        :style="{display: state.todos.length > computes.remaining.value ? 'block' : 'none'}"
      >
        Clear completed
      </button>
    </footer>
  </section>
`;

describe('TodoMVC compile', () => {
  test('should compile without syntax error', () => {
    const code = compile(template);
    console.log('=== GENERATED CODE ===');
    console.log(code);
    console.log('=== END GENERATED CODE ===');
    
    expect(() => {
      new Function('ctx', code);
    }).not.toThrow();
  });
});
