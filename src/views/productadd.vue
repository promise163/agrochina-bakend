<template>
    <div class="container">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="产品名称" prop="title">
        <el-input v-model="ruleForm.title" />
      </el-form-item>
      <el-form-item label="产品类型" prop="productType">
        <el-select v-model="ruleForm.productType" placeholder="">
            <el-option label="Herbicide" value="1"></el-option>
            <el-option label="Insecticide" value="2"></el-option>
            <el-option label="Fungicide" value="3"></el-option>
            <el-option label="Rodenticide" value="4"></el-option>
            <el-option label="Plant Growth Regulator" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品展示优先级" prop="productLevel">
        <el-input v-model="ruleForm.productLevel" />
      </el-form-item>
      <el-form-item label="简述" prop="description" required>
        <el-input v-model="ruleForm.description" type="textarea" />
      </el-form-item>
      <el-form-item label="封面" required>
        <el-upload
            ref="uploadRefs"
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :auto-upload="false"
            :on-change="onChange"
            :on-error="onError"
            :before-upload="beforeAvatarUpload"
            :http-request="requestImage"
        >
            <img v-if="ruleForm.coverImgUrl" :src="ruleForm.coverImgUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <!-- <el-input v-model="ruleForm.coverImgUrl" /> -->
      </el-form-item>
      <el-form-item label="状态" prop="status" required>
        <el-switch
            v-model="ruleForm.status"
            :active-value="1"
            :inactive-value="2"
            active-text="发布"
            inactive-text="下架"
        />
      </el-form-item>
      <el-form-item label="内容" prop="content"> 
        <div class="mgb20" ref="editor"></div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          保存
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="productadd">
import type { UploadProps, UploadUserFile,UploadInstance ,FormInstance, FormRules } from 'element-plus';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import WangEditor from 'wangeditor';
import { fetchUpload ,fetchContentSave} from '../api/index';

interface RuleForm {
    title: string;
    type:string;
    productType:string;
    productLevel:string;
    description: string;
    author: string;
    status: number;
    coverImgUrl: string;
}

const uploadRefs = ref<UploadInstance>()

const editor = ref(null);
let instance: any;

const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
    title: '',
    type:'2', // 产品
    description: '',
    status: 1,
    coverImgUrl: '',
    createBy: localStorage.getItem('ms_username') || '',
    productType:'',
    productLevel:'',
    content:''
});

const rules = reactive<FormRules<RuleForm>>({
    title: [
        { required: true, message: "请输入标题",}
    ],
    description: [
        {
        required: true,
        message: "请输入新闻简述",
        trigger: "blur" 
        }
    ],
    type: [
        {
        required: true,
        message: "请选择产品类型",
        trigger: "change" 
        }
    ],
});

const onError = ()=>{
}

const onChange:UploadProps['onChange'] = (file)=>{
  if(file.status == 'ready'){
    uploadRefs.value!.submit()
  }
}

const requestImage = (files)=>{
  let foramData = new FormData()
  foramData.append('file',files.file)
  fetchUpload(foramData).then(res => {
    res = res.data
		if(res.code == "0"){
			ruleForm.coverImgUrl = import.meta.env.VITE_APP_IMAGE_URL+ '/assets/images/' +  res.data
		}
	});
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if(!instance.txt.html()) return ElMessage.error('请输入产品内容')
      ruleForm.content = instance.txt.html()
      console.log(ruleForm,instance.txt.html(),"submit!");
      fetchContentSave(ruleForm).then(res => {
        res = res.data
        if(res.code == '0'){
          ElMessage.success('保存成功')
          resetForm(ruleFormRef)
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  instance.txt.html('')
};


const handleAvatarSuccess = ()=>{
    
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile)=>{
  if(rawFile.type != 'image/jpeg' && rawFile.type != 'image/png'){
    ElMessage.error('图片格式不对，请检查后上传')
    return false
  } else if (rawFile.size / 1024 > 500) {
    ElMessage.error('图片大小应控制在500K之内!')
    return false
  }
  return true
}

onMounted(() => {
	instance = new WangEditor(editor.value);
	instance.config.zIndex = 1;
  instance.config.height = 500 
  instance.config.uploadImgMaxLength = 1
  instance.config.showLinkImg = false //隐藏插入网络图片的功能，只保留本地上传图片
  instance.config.customUploadImg = function(resultFiles, insertImgFn) {
    if(!beforeAvatarUpload(resultFiles[0])) return
    let foramData = new FormData()
    foramData.append('file',resultFiles[0])
    fetchUpload(foramData).then(res => {
      res = res.data
      if(res.code == "0"){
        insertImgFn( import.meta.env.VITE_APP_IMAGE_URL+ '/assets/images/' + res.data)
      }
    });
  }  //resultFiles 表示上传的所有图片的文件说明，可以循环并使用 insertImgFn 实现图片的插入

	instance.create();
});
onBeforeUnmount(() => {
	instance.destroy();
	instance = null;
});
</script>

<style scoped>
.handle-box {
    display: flex;
    margin-bottom: 20px;
}

.table {
    width: 100%;
    font-size: 14px;
}
.mr10 {
    margin-right: 10px;
}
.avatar-uploader :deep(.el-upload){
    min-width: 200px;
    min-height: 200px;
    border: 1px solid #dcdfe6;
    .avatar{
      height:100%;
    }
}
</style>
