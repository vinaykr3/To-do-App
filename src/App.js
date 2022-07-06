import React, { useState } from 'react'
import 'antd/dist/antd.min.css'
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons"
import "./App.css";
import { Table, Button, Form, Input, Select, Space, Modal, message, Tag } from "antd";
const { TextArea } = Input
const selectOption = ["OPEN", "WORKING", "DONE", "OVERDUE"];
const Dates = new Date();
const fullDate = Dates.getFullYear() + "-" + Dates.getMonth() + "-" + Dates.getDate();


export const App = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [NewData, setNewData] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const [status, setStatus] = useState("OPEN");
  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [date, setDate] = useState(fullDate);
  const [tagData, setTagData] = useState("");
  const [tag, setTag] = useState(["hello"]);

  const columns = [
    {
      key: "1",
      title: "Timestamp",
      dataIndex: "Timestamp",
      sorter: (record1, record2) => {
        return record1.Timestamp > record2.Timestamp
      }
    },
    {
      key: "2",
      title: "Title",
      dataIndex: "Title",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            autoFocus
            placeholder='Type text here'
            value={selectedKeys[0]}
            onChange={(e) => { setSelectedKeys(e.target.value ? [e.target.value] : []) }}
            onPressEnter={() => { confirm(); }}
            onBlur={() => { confirm(); }} >
          </Input>);
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.Title.toLowerCase().includes(value.toLowerCase());
      }
    },
    {
      key: "3",
      title: "Description",
      dataIndex: "Description",
    },
    {
      key: "4",
      title: "Due Date",
      dataIndex: "date",
      sorter: (record1, record2) => {
        return record1.date > record2.date
      }

    },
    {
      key: "5",
      title: "Tag",
      dataIndex: "tag",
      // render: (data) => {

      // }

    },
    {
      key: "6",
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "OPEN", value: "OPEN" },
        { text: "WORKING", value: "WORKING" },
        { text: "DONE", value: "DONE" },
        { text: "OVERDUE", value: "OVERDUE" },
      ],
      onFilter: (value, record) => {
        return record.status === value;
      }
    },
    {
      key: "7",
      title: "Oprations",
      render: (record) => {
        return <>
          <EditOutlined onClick={() => { onEditData(record) }} />
          <DeleteOutlined onClick={() => { onDeletData(record) }} style={{ color: "red", marginLeft: 15 }} />
        </>
      }
    }
  ]

  const ADD_NEW_DATA = (e) => {
    setNewData(true);
  }

  const onDate = (e) => {
    setDate(e.target.value);
  }

  const title = (e) => {
    setTitle(e.target.value);
  }

  const description = (e) => {
    setDescription(e.target.value)
  }

  const optionValue = (e) => {
    setStatus(e);
  }

  const AddData = () => {
    const Timestamp = Math.floor(Date.now() / 1000);
    if (Title === "") {
      setDataSource([...dataSource]);
      setNewData(true);
      message.error("Please fill Title field");
    }
    else if (Description === "") {
      setDataSource([...dataSource]);
      setNewData(true);
      message.error("Please fill Description field");
    }
    else if (Title !== "" || Description !== "") {
      setDataSource(
        [...dataSource, { Timestamp, Title, Description, date, tag, status }]
      )
      setTitle("");
      setDescription("");
      setDate();
      setStatus("OPEN");
      setNewData(false);
    }

    // if (Title !== "" && Description !== "") {
    //   
    // }
  }

  const tagValue = (e) => {
    setTagData(e.target.value);
  }
  const handleTag = (e) => {
    if (e.key === "Enter") {
      setTag([...tag, tagData])
      setTagData("")
    }
  }

  const onDeletData = (Item) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this Data",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource(pre => {
          return pre.filter(data => data.Timestamp !== Item.Timestamp)
        })
      }
    })
  }
  const onEditData = (Item) => {
    setIsEditing(true);
    setEditingData({ ...Item });
  };
  const resetEditing = () => {
    setIsEditing(false);
    setEditingData(null);
  }
  return (
    <div className='App'>
      <header className='App-header'>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button type='primary' className='btn' onClick={ADD_NEW_DATA} >ADD NEW TO-DO</Button>
        </div>
        <Modal title="Add New Data"
          visible={NewData}
          onCancel={() => {
            setNewData(false);
          }}
          onOk={() => {
            setNewData(false);
          }}
        >
          <Form>
            <Form.Item>
              <Input onChange={title} value={Title} maxLength="100" placeholder='write here your title and It is required!' />
            </Form.Item>
            <Form.Item>
              <TextArea onChange={description} value={Description} maxLength="1000" placeholder='write here your description! and It is required!' />
            </Form.Item>
            <Form.Item>
              <Space direction='horizontal'>
                {tag.map((tag, index) => {
                  return (
                    <Tag color="green" closable key={index}>
                      {tag}
                    </Tag>
                  )
                })}
              </Space>
            </Form.Item>
            <div style={{ display: "flex" }}>
              <Form.Item>

                <Space direction="vertical" style={{ marginRight: "5px" }}>
                  <input type="date" onChange={onDate} value={Date} />
                </Space>
                <input type="text" onKeyPress={handleTag} placeholder="fill and click (Optional)" onChange={tagValue} value={tagData} />
              </Form.Item>
              <Form.Item name="status" rules={[
                {
                  required: true,
                  message: "Please choose one of the above",
                }
              ]}>
                <Select onChange={optionValue} value={status} style={{ marginLeft: "5px" }}>
                  {
                    selectOption.map((Items, index) => {
                      return <Select.Option key={index} value={Items}></Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
            </div>
            <Form.Item>
              <Button onClick={AddData} type="primary">Save Data</Button>
            </Form.Item>
          </Form>
        </Modal>

        <Table columns={columns} dataSource={dataSource} pagination={{ pageSize: 5 }}></Table>
        <Modal title="Modify Data"
          visible={isEditing}
          onCancel={() => {
            resetEditing()
          }}
          onOk={() => {
            setDataSource(pre => {
              return pre.map(data => {
                if (data.Timestamp === editingData.Timestamp) {
                  return editingData;
                } else {
                  return data;
                }
              })
            })
            resetEditing()
          }}
        >
          <Form>
            <Form.Item>
              <Input value={editingData?.Title} required={true} onChange={(e) => {
                setEditingData(pre => {
                  return { ...pre, Title: e.target.value }
                })
              }} placeholder='write here your title and It is required!' />
            </Form.Item>
            <Form.Item>
              <TextArea value={editingData?.Description} required={true} onChange={(e) => {
                setEditingData(pre => {
                  return { ...pre, Description: e.target.value }
                })
              }} placeholder='write here your description! and It is required!' />
            </Form.Item>

            <Form.Item>
              <div style={{ display: "flex" }}>
                <Space direction="vertical" style={{ marginRight: "5px" }}>
                  <input value={editingData?.date} onChange={(e) => {
                    setEditingData(pre => {
                      return { ...pre, date: e.target.value }
                    })
                  }} type="date" />
                </Space>
                <input type="text" value={editingData?.tag} onChange={(e) => {
                  setEditingData(pre => {
                    return { ...pre, tag: e.target.value }
                  })
                  }} 
                />
                <Select value={editingData?.status} required={true} onChange={(e) => {
                  setEditingData(pre => {
                    return { ...pre, status: e }
                  })
                }} style={{ marginLeft: "5px" }}>
                  {
                    selectOption.map((Items, index) => {
                      return <Select.Option key={index} value={Items}></Select.Option>
                    })
                  }
                </Select>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </header>
    </div>

  )
}
export default App;