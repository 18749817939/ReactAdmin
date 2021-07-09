import React, { useState, useEffect } from 'react'
import './Product.less'
import { useHistory } from 'react-router-dom'
import { Card, Form, Spin, Input, Upload, Button, Cascader, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import request from '../../api/ajax'
import storage from '../../utils/storage'
const { TextArea } = Input
function AddUpdate(props) {
  let history = useHistory()
  const oldProduct = storage.get('product')
  const [name, setName] = useState('')
  const [Cname, setCname] = useState('')
  const [fileList, setFileList] = useState(
    oldProduct ? oldProduct.imgs.map(img => ({
      uid: img,
      name: img,
      url: `http://120.55.193.14:5000/upload/${img}`
    })) : []
    // [oldProduct.imgs[0],{uid: oldProduct.imgs[1],
    //   name: oldProduct.imgs[1],
    //   url: `http://120.55.193.14:5000/upload/${oldProduct.imgs[1]}`}]
    //刚开始没有注意到新旧上传的图片信息不同，因此使用上述格式把两种信息的图片暴露出来以进行删除
  )
  const [loading, setLoading] = useState(false)
  const productBack = () => {
    history.replace('/home/product/home')
    storage.remove('product')
  }
  const [options, setOptions] = useState([])
  //获取一级分类列表，并进行包装给级联选择框使用，因为级联选择框只有固定的属性，因此为了方便获取二级
  //分类列表，将每个分类的—_id和name组合作为选择项的value属性值，使用时需要再拆分
  //每个分类的_id是作为category和pCategory发送给后台的
  const get = async (parentId) => {
    // const response = await request('/manage/category/list', { parentId })
    const response = await request(`http://159.75.128.32:5000/api/category/list/${parentId}`)
    if (response.status === 0) {
      const arr = response.data.map(item => {
        const obj = {}
        // obj.value = item._id + '_' + item.name
        obj.value = item.id + '_' + item.name
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
  const onFinish = async (values) => {
    const { name, desc, price, categoryId, imgs } = values
    console.log(categoryId)
    let img = []
    if (imgs.fileList) {
      img = imgs.fileList.map(img => img.response ? img.response.data.name : img.name)
      //fileList中包括已经上传过的图片和新上传的图片，上传过的图片和新上传的图片的信息对象不相同，
      //即已经上传过的图片经过上述useState中的fileList初始值处理，因此不再包含response这个信息，所以分两种方式进行处理
    }
    const index0 = categoryId[0].split('_', 2)[0]
    const index1 = categoryId[1].split('_', 2)[0]
    //针对修改和添加显示传递不同的参数，因为添加不需要传递_id
    const product = oldProduct ? {
      // name, desc, price, imgs: img,
      // detail: oldProduct.detail, pCategoryId: oldProduct.pCategoryId,
      // categoryId: oldProduct.categoryId, _id: oldProduct.key
      // } : { name, desc, price, imgs: img, pCategoryId: index0, categoryId: index1 }
      // const response = await request(`/manage/product/${oldProduct? 'update':'add'}`, product, 'POST')
      name, desc, price, images: 'img',
      detail: oldProduct.detail, pcategoryId: oldProduct.pCategoryId,
      categoryId: oldProduct.categoryId, id: oldProduct.key
    } : { name, desc, price, images: `12`, pcategoryId: index0, categoryId: index1 }
    const response = await request(`http://159.75.128.32:5000/api/products/${oldProduct ? 'updateProduct' : 'addProduct'}${oldProduct ? `/${oldProduct.key}` : ''}`,
      product, `${oldProduct ? 'PUT' : 'POST'}`)
    if (response.status === 0) {
      history.replace('/home/product/home')
      message.success(`${oldProduct ? '修改' : '添加'}成功`)
    } else {
      message.error(`${oldProduct ? '修改' : '添加'}失败`)
    }
  }
  const onChangeOptions = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  }
  const loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    console.log(selectedOptions)
    targetOption.loading = true
    const key = targetOption.value.split('_', 2)[0]
    //动态获取二级分类列表
    setTimeout(async () => {
      targetOption.loading = false;
      await get(`${key}`).then(options => targetOption.children = options)
      targetOption.isLeaf = true
      setOptions([...options]);
    }, 500);
  };
  //修改商品时默认显示该商品分类，此处用于获取商品分类
  const getInfo = async () => {
    setLoading(true)
    // if (oldProduct.pCategoryId === '0') {
    // const response = await request(`/ manage / category / info`, { categoryId: oldProduct.categoryId })
    if (oldProduct.pcategoryId === '0') {
      const response = await request(`http://159.75.128.32:5000/api/products/findById/${oldProduct.categoryId}`)

      setName(response.name)
    } else {
      // const response1 = await request(`/manage/category/info`, { categoryId: oldProduct.categoryId })
      // const response2 = await request(`/manage/category/info`, { categoryId: oldProduct.pCategoryId })
      // setName(response1.data.name)
      // setCname(response2.data.name)
      const response1 = await request(`http://159.75.128.32:5000/api/products/findById/${oldProduct.categoryId}`)
      const response2 = await request(`http://159.75.128.32:5000/api/products/findById/${oldProduct.pCategoryId}`)
      setName(response1.name)//没有使用data包裹数据
      setCname(response2.name)//没有使用data包裹数据
    }
    setLoading(false)
  }
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  //图片预览方式
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
    // oldProduct ?
    loading ?
      <Spin size="large" className='spin' />
      : <div className='detail-container'>
        <Card title={
          <span>
            <ArrowLeftOutlined onClick={productBack} style={{ color: '#1DA57A' }} />
            &nbsp;&nbsp;{oldProduct ? '修改商品' : '添加商品'}
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
              initialValue={oldProduct ? oldProduct.name : ''}
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
              initialValue={oldProduct ? oldProduct.desc : ''}

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
              initialValue={oldProduct ? oldProduct.price : ''}

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
              initialValue={oldProduct ? [`${Cname}`, `${name}`] : []}

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
              initialValue={oldProduct ?
                oldProduct.imgs.map(img =>
                  img ?
                    <img className='product-img'
                      key={img}
                      // src={`http://120.55.193.14:5000/upload/${img}`}
                      src={`http://120.55.193.14:5000/files/${img}`}
                      alt="img" /> : ''
                ) : null
              }
            >
              <Upload
                // action="/manage/img/upload"
                action='http://159.75.128.32:5000/uploadFile'
                accept='image/*'
                listType="picture-card"
                name='image'
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
              >
                {fileList.length < 5 && '+上传图片'}
              </Upload>
            </Form.Item>
            <Form.Item
              label="商品详情："
              className='addupdate-detail addupdate-detail-imgs' name="detail"
              initialValue={oldProduct ? oldProduct.detail : ''}
            >
              <TextArea rows={2} placeholder="请输入商品详情" style={{ width: '500px' }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    // : <div>meiyou</div>
  )
}

export default AddUpdate;