<template>
	<div class="container">
	  <el-form :inline="true" :model="formInline" class="demo-form-inline">
		<el-form-item label="姓名">
		  <el-input v-model="formInline.name" placeholder="姓名"></el-input>
		</el-form-item>
		<el-form-item label="联系方式">
		  <!-- <el-select v-model="formInline.phone" placeholder="联系方式">
			<el-option label="区域一" value="shanghai"></el-option>
			<el-option label="区域二" value="beijing"></el-option>
		  </el-select> -->
		  <el-input v-model="formInline.phone" placeholder="联系方式"></el-input>
		</el-form-item>
		<el-form-item>
		  <el-button type="primary" :icon="Search" @click="getData">查询</el-button>
		</el-form-item>
	  </el-form>
	  <el-table
		:data="tableData"
		style="width: 100%"
		:border="true"
		max-height="500"
		min-height="200"
	  >
	  	<el-table-column
		  align="center"
		  header-align="center"
		  prop="name"
		  label="姓名"
		  width="220"
		/>
		<el-table-column
		  align="center"
		  header-align="center"
		  prop="name"
		  label="邮箱"
		  width="220"
		/>
		<el-table-column
		  align="center"
		  header-align="center"
		  prop="phone"
		  label="联系方式"
		  width="220"
		/>
		<el-table-column
		  align="center"
		  header-align="center"
		  prop="company"
		  label="公司名"
		  width="250"
		/>
		<el-table-column
		  align="center"
		  header-align="center"
		  prop="message"
		  label="留言信息"
		  width="600"
		/>
		<el-table-column
		  align="center"
		  header-align="center"
		  prop="createTime"
		  label="提交时间"
		  width="180"
		/>
	  </el-table>
	  <div class="pagination">
		<el-pagination
		  background
		  v-model:page-size="formInline.pageNum"
		  v-model:current-page="formInline.pageSize"
		  layout="prev, pager, next"
		  @size-change="changeSize"
		  @current-change="changeCruurent"
		  :total="total"
		  hide-on-single-page
		/>
	  </div>
	</div>
  </template>

<script setup lang="ts">
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { ref } from "vue";
import { fetchCustomList } from '../api/index';


const formInline = ref({
  company: "",
  email: "",
  name: "",
  phone: "",
  message: "",
  pageNum: 1,
  pageSize: 10
});

const total = ref(0)

const tableData = ref([]);

const getData = () => {
	fetchCustomList(formInline.value).then(res => {
		res = res.data
		if(res.code == "0"){
			tableData.value = res.data.records;
			total.value = Math.ceil(res.data.total/formInline.value.pageSize);
		}
	});
};

const changeSize = (size: number) => {
  formInline.pageSize = size;
};
const changeCruurent = (index: number) => {
  formInline.pageNum = index;
};
</script>



<style scoped>
.content {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 10px 15px 10px;
  
}
.pagination {
    height: 80px;
    padding: 15px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
