const iamgekit = require("imagekit");
const { v4: uuidv4 } = require("uuid");

const imagekit = new iamgekit({
	publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
	privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
	urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadImage = async ({ buffer, folder = "/PRODUCT" }) => {
	const res = await imagekit.upload({
		file: buffer,
		fileName: uuidv4(),
		folder,
	});

	return {
		url: res.url,
		thubnailUrl: res.thumbnailUrl || res.url,
		id: res.fileId,
	};
};


module.exports = { uploadImage};