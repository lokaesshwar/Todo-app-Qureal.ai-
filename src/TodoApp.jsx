import React, { useState } from 'react';
import { List, Checkbox, Input, Button, Form, message, ConfigProvider, theme, Space } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import directus from './lib/directus';

export default function TodoApp() {
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const queryClient = useQueryClient();

  const fetchTodos = async () => {
    const { data } = await directus.items('todo').readByQuery({ sort: ['-id'] });
    return data || [];
  };

  const { data: todos = [], isLoading, isError, error } = useQuery(['todos'], fetchTodos);

  const addTodo = useMutation(
    title => directus.items('todo').createOne({ title, is_completed: false }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['todos']);
        message.success('Task added!');
        form.resetFields();
      },
      onError: () => message.error('Could not add task'),
    }
  );

  const toggleComplete = useMutation(
    ({ id, is_completed }) => directus.items('todo').updateOne(id, { is_completed }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['todos']);
        message.success('Task updated!');
      },
      onError: () => message.error('Could not update task'),
    }
  );

  const deleteTodo = useMutation(
    id => directus.items('todo').deleteOne(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['todos']);
        message.success('Task deleted!');
      },
      onError: () => message.error('Could not delete task'),
    }
  );

  const saveEdit = (id) => {
    if (!editingText.trim()) {
      message.error('Task can\'t be empty');
      return;
    }
    directus.items('todo').updateOne(id, { title: editingText })
      .then(() => {
        queryClient.invalidateQueries(['todos']);
        setEditingId(null);
        setEditingText('');
        message.success('Task updated!');
      })
      .catch(() => message.error('Could not update task'));
  };

  const onFinish = values => addTodo.mutate(values.title);

  if (isLoading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (isError) return <div style={{ padding: 20, color: 'red' }}>Error: {error.message}</div>;

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div style={{ maxWidth: 600, margin: '40px auto 0', background: '#141414', color: '#fff', borderRadius: 8, padding: 16 }}>
        <Form form={form} onFinish={onFinish} layout="inline" style={{ marginBottom: 20 }}>
          <Form.Item name="title" rules={[{ required: true, message: 'Enter task' }]} style={{ flex: 1 }}>
            <Input placeholder="Add a new task" style={{ background: '#1f1f1f', color: '#fff', border: '1px solid #434343' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={addTodo.isLoading}>Add</Button>
          </Form.Item>
        </Form>

        <List
          bordered
          dataSource={todos}
          style={{ background: '#1f1f1f', color: '#fff', borderRadius: 8 }}
          renderItem={todo => (
            <List.Item
              key={todo.id}
              style={{ background: '#141414', color: '#fff' }}
              actions={[
                <Space key="actions" size="small">
                  {editingId !== todo.id ? (
                    <Button type="dashed" onClick={() => { setEditingId(todo.id); setEditingText(todo.title); }}>
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button type="primary" onClick={() => saveEdit(todo.id)}>Save</Button>
                      <Button type="primary" onClick={() => { setEditingId(null); setEditingText(''); }}>Cancel</Button>
                    </>
                  )}
                  <Button danger type="dashed" onClick={() => deleteTodo.mutate(todo.id)}>Delete</Button>
                </Space>,
              ]}
            >
              <Checkbox
                checked={todo.is_completed}
                onChange={e => toggleComplete.mutate({ id: todo.id, is_completed: e.target.checked })}
                style={{ color: '#fff' }}
              >
                {editingId === todo.id ? (
                  <Input
                    value={editingText}
                    onChange={e => setEditingText(e.target.value)}
                    onPressEnter={() => saveEdit(todo.id)}
                    onBlur={() => saveEdit(todo.id)}
                    autoFocus
                    style={{ background: '#1f1f1f', color: '#fff', border: '1px solid #434343' }}
                  />
                ) : (
                  todo.title
                )}
              </Checkbox>
            </List.Item>
          )}
        />
      </div>
    </ConfigProvider>
  );
}








// import React, { useState } from 'react';
// import { List, Checkbox, Input, Button, Form, message, ConfigProvider, theme, Space } from 'antd';

// export default function TodoApp() {
//   const [todos, setTodos] = useState([]);
//   const [form] = Form.useForm();
//   const [editingId, setEditingId] = useState(null);
//   const [editingText, setEditingText] = useState('');

//   const addTodo = (values) => {
//     if (!values.task) return;
//     const newTask = {
//       id: Date.now(),
//       task: values.task,
//       completed: false,
//     };
//     setTodos([newTask, ...todos]);
//     form.resetFields();
//     message.success('Task added!');
//   };

//   const toggleTodo = (id) => {
//     setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
//   };

//   const deleteTodo = (id) => {
//     setTodos(todos.filter(todo => todo.id !== id));
//     message.success('Task deleted!');
//   };

//   const startEditing = (todo) => {
//     setEditingId(todo.id);
//     setEditingText(todo.task);
//   };

//   const cancelEditing = () => {
//     setEditingId(null);
//     setEditingText('');
//   };

//   const saveEditing = (id) => {
//     if (!editingText.trim()) {
//       message.error('Task cannot be empty!');
//       return;
//     }
//     setTodos(todos.map(todo => todo.id === id ? { ...todo, task: editingText } : todo));
//     setEditingId(null);
//     setEditingText('');
//     message.success('Task updated!');
//   };

//   return (
//     <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
//       <div
//         style={{
//           maxWidth: 600,
//           margin: '0 auto',
//           marginTop: 40,
//           background: '#141414',
//           color: '#fff',
//           borderRadius: 8,
//           padding: 16,
//         }}
//       >
//         <Form form={form} onFinish={addTodo} layout="inline" style={{ marginBottom: 20 }}>
//           <Form.Item
//             name="task"
//             rules={[{ required: true, message: 'Enter task' }]}
//             style={{ flex: 1 }}
//           >
//             <Input
//               placeholder="Add a new task"
//               style={{
//                 background: '#1f1f1f',
//                 color: '#fff',
//                 border: '1px solid #434343',
//               }}
//             />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Add
//             </Button>
//           </Form.Item>
//         </Form>

//         <List
//           bordered
//           dataSource={todos}
//           style={{ background: '#1f1f1f', color: '#fff', borderRadius: 8 }}
//           renderItem={todo => (
//             <List.Item
//               key={todo.id}
//               style={{ background: '#141414', color: '#fff' }}
//               actions={[
//                 <Space size="small">
//                   {editingId !== todo.id ? (
//                     <Button type="primary" onClick={() => startEditing(todo)}>
//                       Edit
//                     </Button>
//                   ) : (
//                     <>
//                       <Button type="primary" onClick={() => saveEditing(todo.id)}>
//                         Save
//                       </Button>
//                       <Button type="primary" onClick={cancelEditing}>
//                         Cancel
//                       </Button>
//                     </>
//                   )}
//                   <Button danger type="dashed" onClick={() => deleteTodo(todo.id)}>
//                     Delete
//                   </Button>
//                 </Space>,
//               ]}
//             >
//               <Checkbox
//                 checked={todo.completed}
//                 onChange={() => toggleTodo(todo.id)}
//                 style={{ color: '#fff' }}
//               >
//                 {editingId === todo.id ? (
//                   <Input
//                     value={editingText}
//                     onChange={(e) => setEditingText(e.target.value)}
//                     onPressEnter={() => saveEditing(todo.id)}
//                     onBlur={() => saveEditing(todo.id)}
//                     autoFocus
//                     style={{
//                       background: '#1f1f1f',
//                       color: '#fff',
//                       border: '1px solid #434343',
//                     }}
//                   />
//                 ) : (
//                   todo.task
//                 )}
//               </Checkbox>
//             </List.Item>
//           )}
//         />
//       </div>
//     </ConfigProvider>
//   );
// }




