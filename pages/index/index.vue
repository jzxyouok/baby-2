<template>
	<view class="content" v-if="isShow">
		<image src="../../static/1024.png" class="logo"></image>
		<button type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo">
			微信授权登录
		</button>
	</view>
</template>

<script>
	let redirect = "";
	export default {
		data() {
			return {
				title: 'Hello',
				code: '',
				isShow: false
			};
		},
		onLoad(options) {
			// uni.switchTab({
			// 	url: '/pages/home/index/index',
			// 	success: () => {}
			// });
			if (options.redirect) {
				redirect = options.redirect
			}
			if (options.queryObj) {
				let queryObj = JSON.parse(options.queryObj)
				let queryStr = ""
				let arr = []
				Object.keys(queryObj).forEach((key) => {
					queryStr = key + "=" + queryObj[key]
					arr.push(queryStr)
				})
				redirect = redirect + "?" + arr.join('&')
			}
			if (uni.getStorageSync('access_token')) {
				this.isShow = false;
				uni.switchTab({
					url: '/pages/home/index/index',
					success: () => {}
				});
			} else {
				this.isShow = true;
				uni.login({
					provider: 'weixin',
					success: loginRes => {
						console.log(loginRes)
						this.code = loginRes.code;
					}
				});
			}
		},
		methods: {
			getWXCode() {
				return new Promise((res, rej) => {
					uni.login({
						provider: 'weixin',
						success: loginRes => {
							res(loginRes.code);
						},
						fail: err => {
							rej(err);
						}
					});
				});
			},
			async getUserInfo(e) {
				if (e.detail.errMsg == 'getUserInfo:ok') {
					uni.showLoading({
						title: '登录中'
					});
					let data = {};
					if (!this.code) {
						//token过期时重新获取code
						this.code = await this.getWXCode();
					}
					Object.assign(data, e.detail, {
						code: this.code
					});
					console.log(data)
					this.api.home.wx_login(
						data,
						res => {
							console.log(res)
							let access_token = res.data.userId + "_" + res.data.token
							uni.setStorageSync('access_token', access_token);
							console.log(redirect)
							if (redirect) {
								uni.redirectTo({
									url: redirect,
									success: () => {
										uni.hideLoading();
									},
									fail: () => {
										uni.switchTab({
											url: redirect,
											success: () => {
												uni.hideLoading();
											}
										});
									}
								});
							} else {
								uni.switchTab({
									url: '/pages/home/index/index',
									success: () => {
										uni.hideLoading();
									}
								});
							}
						},
						err => {
							uni.hideLoading();
						}
					);
				}
			}
		}
	};
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		width: 300upx;
		height: 300upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}

	button {
		width: 80%;
		margin-left: 10%;
	}
</style>
