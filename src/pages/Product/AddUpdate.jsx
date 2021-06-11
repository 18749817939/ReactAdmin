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
  const oldProduct = storage.get('product')
  const [name, setName] = useState('')
  const [Cname, setCname] = useState('')
  const [fileList, setFileList] = useState(oldProduct.imgs.map(img=>({
    uid:img,
    name:img,
    url:`http://120.55.193.14:5000/upload/${img}`
  })));//修改时显示商品的图片信息
  const [loading, setLoading] = useState(false)
  const productBack = () => {
    history.replace('/home/product/home')
    storage.remove('product')
  }
  const [options, setOptions] = useState([]);
  const get = async (parentId) => {
    const response = await request('/manage/category/list', { parentId });
    if (response.status === 0) {
      const arr = response.data.map(item => {
        const obj = {}
        obj.value = item._id + '_' + item.name
        obj.label = item.name
        parentId === '0' ? obj.isLeaf = false : obj.isLeaf = true
        obj.parentId = item.parentId
        return obj
      })
      return arr
    } else {
      message.error('获取列表失败')
    }
  }
  const onFinish = async(values) => {
    console.log(values)
    const { name, desc, price, categoryId, imgs } = values
    const index = categoryId.indexOf('_')
    const product = {
      name, desc, price, imgs:oldProduct.imgs, 
      detail: oldProduct.detail,pCategoryId:oldProduct.pCategoryId,
      categoryId:oldProduct.categoryId,_id:oldProduct.key
    }
    const response = await request('/manage/product/update', product, 'POST')
    if(response.status === 0){
      history.replace('/home/product/home')
      message.success('修改成功')
    }else{
      message.error('修改失败')

    }
  }
  const onChangeOptions = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };
  const loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    console.log(selectedOptions)
    targetOption.loading = true
    const key = targetOption.value.split('_', 2)[0]
    setTimeout(async () => {
      targetOption.loading = false;
      await get(`${key}`).then(options => targetOption.children = options)
      targetOption.isLeaf = true
      setOptions([...options]);
    }, 500);
  };
  const getInfo = async () => {
    setLoading(true)
    if (oldProduct.pCategoryId === '0') {
      const response = await request(`/manage/category/info`, { categoryId: oldProduct.categoryId })
      setName(response.name)
    } else {
      const response1 = await request(`/manage/category/info`, { categoryId: oldProduct.categoryId })
      const response2 = await request(`/manage/category/info`, { categoryId: oldProduct.pCategoryId })
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
  useEffect(() => {
    get('0').then(arr => setOptions(arr))
    if (oldProduct) {
      getInfo()
    }
  }, [])
  return (
    oldProduct ?
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
                className='addupdate-detail' name="name"
                rules={[
                  {
                    required: true,
                    message: 'Please input 商品名称!',
                  },
                ]}
                initialValue={oldProduct.name}
              >
                <Input name="test1" style={{ width: '500px' }} />
              </Form.Item>
              <Form.Item
                label="商品描述："
                className='addupdate-detail' name="desc"
                rules={[
                  {
                    required: true,
                    message: 'Please input 商品描述!',
                  },
                ]}
                initialValue={oldProduct.desc}

              >
                <TextArea rows={2} placeholder="请输入商品描述" style={{ width: '500px' }} />
              </Form.Item>
              <Form.Item
                label="商品价格："
                className='addupdate-detail' name="price"
                rules={[
                  {
                    required: true,
                    message: 'Please input 商品价格!',
                  },
                ]}
                initialValue={oldProduct.price}

              >
                <Input prefix="￥" suffix="RMB" style={{ width: '500px' }} />
              </Form.Item>
              <Form.Item
                label="商品分类："
                className='addupdate-detail' name="categoryId"
                rules={[
                  {
                    required: true,
                    message: 'Please input 商品分类!',
                  },
                ]}
                initialValue={[`${Cname}`, `${name}`]}

              >
                <Cascader
                  options={options}
                  loadData={loadData}
                  style={{ width: '500px' }}
                  onChange={onChangeOptions}
                  changeOnSelect
                />
              </Form.Item>
              <Form.Item
                label="商品图片："
                className='addupdate-detail addupdate-detail-imgs'
                name="imgs"
                initialValue={
                  oldProduct.imgs.map(img =>
                    img ?
                      <img className='product-img'
                        key={img}
                        src={`http://120.55.193.14:5000/upload/${img}`}
                        alt="img" /> : ''
                  )
                }
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