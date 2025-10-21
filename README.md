Step 1: Download file and extract or Clone
<br>
Step 2: 
<br>
Move to client folder: cd client
<br>
Download node: npm install
<br>
  <img width="530" height="94" alt="image" src="https://github.com/user-attachments/assets/d5783d25-d11e-472c-a11b-8e7fc323d12a" />
<br>
Step 3: Create .env in server folder
<br>
  <img width="271" height="465" alt="image" src="https://github.com/user-attachments/assets/0a5d2fc9-3396-4cb5-9318-654862b0266a" />
<br>
Config your environment variable:
<br>
DATABASE_URL=
<br>
CLOUDINARY_CLOUD_NAME=
<br>
CLOUDINARY_API_KEY=
<br>
CLOUDINARY_API_SECRET=
<br>
JWT_SECRET=
<br>
GOOGLE_CLIENT_ID=
<br>
GOOGLE_CLIENT_SECRET=
<br>
EMAIL_USER=
<br>
EMAIL_PASS=
<br>
save .env
<br>
Create .env in client folder
<br>
VITE_API_URL=
<br>
Step 4:
<br>
Move to server folder: cd ../server
<br>
Download node: npm install  
<br>
  <img width="493" height="87" alt="image" src="https://github.com/user-attachments/assets/186f16a3-d158-413c-9ab1-100a60447582" />
<br>
Step 5: Connect to database
<br>
npx prisma generate
<br>
  <img width="520" height="40" alt="image" src="https://github.com/user-attachments/assets/be7611f4-babf-4e70-a927-62930fb8312d" />
<br>
Step 6: Run
In server folder: npm run dev
Change to new cmd: in client folder: npm run dev
<img width="662" height="336" alt="image" src="https://github.com/user-attachments/assets/c33c3c8e-21fe-4baf-b32f-e74252890267" />
<img width="658" height="292" alt="image" src="https://github.com/user-attachments/assets/c2ee8c03-28b0-4c20-a6cc-74e80a685046" />



