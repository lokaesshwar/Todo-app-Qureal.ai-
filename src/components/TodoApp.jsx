import React, { useState } from 'react';
import { List, Typography, Spin, Alert, Input, Button, Popconfirm, message, Modal, Form } from 'antd';
import { useTodos } from '../hooks/useTodos';

const { Text, Title } = Typography;

function TodoApp() {
  const {
    todos,
    isLoading,
    isError,
    error,
    addTodoMutation,
    updateTodoMutation,
    toggleCompletedMutation,
    deleteTodoMutation,
  } = useTodos();

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTodo, setEditTodo] = useState(null);

  const handleAdd = () => {
    if (!newTitle.trim()) {
      message.warning('Title is required');
      return;
    }
    addTodoMutation.mutate({ title: newTitle, content: newContent, is_completed: false });
    setNewTitle('');
    setNewContent('');
  };

  const openEditModal = (todo) => {
    setEditTodo(todo);
    setEditModalVisible(true);
  };

  const handleEditFinish = (values) => {
    updateTodoMutation.mutate({ id: editTodo.id, title: values.title, content: values.content });
    setEditModalVisible(false);
    setEditTodo(null);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <Spin tip="Loading todos..." size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Error"
        description={error.message}
        type="error"
        showIcon
        style={{ margin: 20 }}
      />
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px' }}>
      <Title level={2}>Todo App</Title>

      <div style={{ display: 'flex', gap: '8px', marginBottom: 20 }}>
        <Input
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={addTodoMutation.isLoading}
        />
        <Input
          placeholder="Content (optional)"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          disabled={addTodoMutation.isLoading}
        />
        <Button
          type="primary"
          onClick={handleAdd}
          loading={addTodoMutation.isLoading}
        >
          Add
        </Button>
      </div>

      <List
        bordered
        dataSource={todos}
        renderItem={(todo) => (
          <List.Item
            actions={[
              <Button
                key="toggle"
                type={todo.is_completed ? 'default' : 'primary'}
                loading={toggleCompletedMutation.isLoading}
                onClick={() => toggleCompletedMutation.mutate({ id: todo.id, is_completed: todo.is_completed })}
              >
                {todo.is_completed ? 'Mark Undone' : 'Mark Done'}
              </Button>,

              <Button key="edit" onClick={() => openEditModal(todo)}>
                Edit
              </Button>,

              <Popconfirm
                key="delete"
                title="Are you sure to delete this todo?"
                onConfirm={() => deleteTodoMutation.mutate(todo.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger loading={deleteTodoMutation.isLoading}>
                  Delete
                </Button>
              </Popconfirm>,
            ]}
          >
            <Text delete={todo.is_completed} strong>
              {todo.title}
            </Text>
            <br />
            <Text type="secondary" style={{ marginLeft: 12 }}>
              {todo.content}
            </Text>
          </List.Item>
        )}
      />

      <Modal
        title="Edit Todo"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        {editTodo && (
          <Form
            initialValues={{ title: editTodo.title, content: editTodo.content }}
            onFinish={handleEditFinish}
            layout="vertical"
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please input the title!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="content" label="Content">
              <Input />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateTodoMutation.isLoading}
              >
                Save
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}

export default TodoApp;
