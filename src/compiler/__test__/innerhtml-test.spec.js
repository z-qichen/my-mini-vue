import { compile } from '../compile';

// Simulate exactly what the browser does:
// 1. Create a div with innerHTML set to the template
// 2. Read back innerHTML (browser re-serializes)
// 3. Compile the re-serialized HTML
describe('innerHTML round-trip', () => {
  test('round-trip should produce valid code', () => {
    // This is the exact HTML that's inside #app in todomvc.html
    const originalHTML = `
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

    // Step 1: Create a div and set innerHTML (simulating browser loading)
    const div = document.createElement('div');
    div.innerHTML = originalHTML;

    // Step 2: Read back innerHTML (browser re-serializes)
    const serialized = div.innerHTML;
    console.log('=== SERIALIZED (JSON) ===');
    console.log(JSON.stringify(serialized));
    console.log('=== SERIALIZED (RAW) ===');
    console.log(serialized);

    // Step 3: Compile
    const code = compile(serialized);
    console.log('=== COMPILED ===');
    console.log(code);

    // Step 4: Check for syntax errors
    expect(() => {
      new Function('ctx', code);
    }).not.toThrow();
  });
});
