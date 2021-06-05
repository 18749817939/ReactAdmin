import React, { useState, useEffect } from 'react'
import './Product.less'
import { useHistory, Redirect } from 'react-router-dom'
import { Card, Form, Spin, Input, Upload, Button, Cascader, message } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import request from '../../api/ajax'
import storage from '../../utils/storage'
const { TextArea } = Input;
function AddUpdate(props) {
  let history = useHistory()
  const [name, setName] = useState('')
  const [Cname, setCname] = useState('')
  const [category, setCategory] = useState([])

  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false)
  const product = storage.get('product')
  const productBack = () => {
    history.replace('/home/product/home')
    storage.remove('product')
  }
  const get = async (parentId) => {
    const response = await request('/manage/category/list', { parentId });
    if (response.status === 0) {
      const arr = response.data.map(item => {
        const obj = {}
        obj.key = item._id
        obj.value = item.name
        obj.label = item.name
        obj.parentId = item.parentId
        return obj
      })
      return arr
    } else {
      message.error('获取分类失败')
    }
  }
  const getOptions = () => {
    // const options = get(0).map(item => {
    //   const obj = {}
    //   obj.name = item.name
    //   obj.value = item.name
    //   obj.children = get(item.parentId).map(item => {
    //     const obj = {}
    //     obj.name = item.name
    //     obj.value = item.name
    //     return obj
    //   })
    //   return obj
    // }
  }
  const onFinish = (values) => {
    const { productName, productDetail, productPrice, productCategory, productImgs } = values
    console.log(values)
    const nowProduct = {
      productName, productDetail, productPrice, productCategory, productImgs
    }
    console.log(nowProduct)



  }
  const getInfo = async () => {
    setLoading(true)
    if (product.pCategoryId === '0') {
      const response = await request(`/manage/category/info`, { categoryId: product.categoryId })
      setName(response.name)
    } else {
      const response1 = await request(`/manage/category/info`, { categoryId: product.categoryId })
      const response2 = await request(`/manage/category/info`, { categoryId: product.pCategoryId })
      setName(response1.data.name)
      setCname(response2.data.name)
    }
    setLoading(false)
  }
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };


  const options = [
    {
      value: 'zhejiang',
      label: 'Zhejiang1',
      children: [
        {
          value: 'hangzhou',
          label: 'Hangzhou',

        },
      ],
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu2',
      children: [
        {
          value: 'nanjing',
          label: 'Nanjing',

        },
      ],
    },
  ];

  const onChanges = (value) => {
    console.log(value);
  }
  useEffect(() => {
    product ?
      getInfo()
      : <Redirect to='/home/product/home'></Redirect>
  }, [])
  return (
    product ?
      loading ?
        <Spin size="large" className='spin' />
        : <div className='detail-container'>
          <Card title={
            <span>
              <ArrowLeftOutlined onClick={productBack} style={{ color: '#1DA57A' }} />
          &nbsp;&nbsp;添加商品
        </span>
          }
            className='detail'
          >
            <Form name="addupdate"
              className="addupdate"
              initialValues={{ remember: true }}
              onFinish={onFinish}>
              <Form.Item
                label="商品名称："
                className='addupdate-detail' name="productName"
                rules={[
                  {
                    required: true,
                    message: 'Please input 商品名称!',
                  },
                ]}
              >
                <Input name="test1" style={{ width: '500px' }} />
              </Form.Item>
              <Form.Item
                label="商品描述："
                className='addupdate-detail' name="productDetail"
                rules={[
                  {
                    required: true,
                    message: 'Please input 商品描述!',
                  },
                ]}
              >
                <TextArea rows={2} placeholder="请输入商品描述" style={{ width: '500px' }} />
              </Form.Item>
              <Form.Item
                label="商品价格："
                className='addupdate-detail' name="productPrice"
                rules={[
                  {
                    required: true,
                    message: 'Please input 商品价格!',
                  },
                ]}
              >
                <Input prefix="￥" suffix="RMB" style={{ width: '500px' }} />
              </Form.Item>
              <Form.Item
                label="商品分类："
                className='addupdate-detail' name="productCategory"
                rules={[
                  {
                    required: true,
                    message: 'Please input 商品分类!',
                  },
                ]}
              >
                <Cascader options={options} style={{ width: '500px' }}
                  onChange={onChanges} placeholder="Please select" />
              </Form.Item>
              <Form.Item
                label="商品图片："
                className='addupdate-detail addupdate-detail-imgs' name="productImgs"
              >
                <Upload
                  action="/manage/img/upload"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                >
                  {fileList.length < 5 && '+上传图片'}
                </Upload>

              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      : <div>meiyou</div>
  )
}

export default AddUpdate;