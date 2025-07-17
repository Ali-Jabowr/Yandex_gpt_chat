# Yandex GPT Chat

A modern, feature-rich AI chat application built with Next.js and integrated with Yandex GPT API. This application provides an interactive chat interface with PDF document processing capabilities, knowledge base integration, and advanced UI features.

## 🚀 Features

### Core Features
- **AI-Powered Chat**: Real-time conversations with Yandex GPT
- **PDF Processing**: Upload and extract text from PDF documents for context-aware conversations
- **Knowledge Base Integration**: Pre-built knowledge base with automatic chunk processing
- **Real-time Typing Effects**: Smooth typing animations for AI responses
- **Message Rating System**: Rate AI responses with thumbs up/down feedback

### Advanced UI Features
- **Dark/Light Theme Toggle**: Customizable theme switching
- **Search Functionality**: Search through chat history (Ctrl+F)
- **Keyboard Shortcuts**: Quick actions via keyboard shortcuts
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Modern Glass-morphism UI**: Beautiful translucent design elements
- **Floating Action Button**: Quick access to common actions
- **Notification System**: Toast notifications for user feedback

### Technical Features
- **Multiple PDF Processing Methods**: Supports various PDF extraction libraries
- **Status Indicators**: Real-time connection and processing status
- **Export Functionality**: Export chat conversations
- **Voice Input Support**: Voice-to-text input capabilities
- **Advanced File Upload**: Drag-and-drop PDF upload with progress indicators
- **Message Status Tracking**: Track message delivery status

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion
- **PDF Processing**: 
  - pdf-parse
  - pdf2json
  - pdfjs-dist
  - @pdftron/pdfnet-node
- **AI Integration**: Yandex GPT API
- **Text Processing**: Natural language processing with `natural` library
- **Build Tools**: Turbopack for fast development

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/yandex-gpt-chat.git
   cd yandex-gpt-chat
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add your Yandex GPT API credentials:
   ```env
   YANDEX_GPT_API_KEY=your_api_key_here
   YANDEX_GPT_FOLDER_ID=your_folder_id_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### API Setup
1. Get your Yandex GPT API credentials from the [Yandex Cloud Console](https://console.cloud.yandex.ru/)
2. Create a service account and generate an API key
3. Add the credentials to your `.env.local` file

### Knowledge Base Setup
The application includes a knowledge base system that processes documents into chunks for better context understanding. You can customize the knowledge base by:
1. Adding documents to the knowledge base directory
2. Running the knowledge base initialization script
3. Configuring chunk size and processing parameters

## 🎯 Usage

### Basic Chat
- Type your message in the input field
- Press Enter or click Send to submit
- AI responses will appear with typing animations

### PDF Processing
1. Click the "Upload PDF" button in the header
2. Select a PDF file from your device
3. The system will extract text and make it available for AI context
4. Ask questions about the PDF content

### Keyboard Shortcuts
- **Ctrl/Cmd + K**: Focus on input field
- **Ctrl/Cmd + F**: Open search
- **Ctrl/Cmd + ,**: Open settings
- **Escape**: Close modals and panels

### Advanced Features
- **Message Rating**: Click thumbs up/down on AI responses
- **Search**: Use the search feature to find specific conversations
- **Export**: Export your chat history in various formats
- **Voice Input**: Use voice-to-text for hands-free messaging

## 🏗️ Project Structure

```
yandex-gpt-chat/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/           # Main chat API endpoint
│   │   │   ├── knowledge-base/ # Knowledge base management
│   │   │   ├── process-pdf/    # PDF processing endpoints
│   │   │   └── process-pdf-v2/ # Enhanced PDF processing
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # App layout
│   │   └── page.tsx            # Main page
│   ├── components/
│   │   ├── ChatContainer.tsx   # Main chat interface
│   │   ├── MessageBubble.tsx   # Individual message component
│   │   ├── ThemeToggle.tsx     # Theme switching
│   │   ├── SearchBar.tsx       # Search functionality
│   │   ├── SettingsPanel.tsx   # Settings interface
│   │   └── ...                 # Other UI components
│   ├── lib/
│   │   ├── knowledgeBase.ts    # Knowledge base utilities
│   │   ├── contextBuilder.ts   # Context building logic
│   │   └── ...                 # Other utilities
│   └── styles/
├── public/                     # Static assets
├── .gitignore                  # Git ignore rules
├── package.json               # Dependencies and scripts
├── next.config.ts             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## 🔌 API Endpoints

### `/api/chat`
- **Method**: POST
- **Purpose**: Process chat messages and get AI responses
- **Payload**: `{ messages: Message[], pdfContext?: string }`

### `/api/process-pdf`
- **Method**: POST
- **Purpose**: Extract text from uploaded PDF files
- **Payload**: FormData with PDF file

### `/api/knowledge-base`
- **Method**: GET
- **Purpose**: Get knowledge base information and status
- **Response**: Knowledge base metadata and statistics

## 🎨 Customization

### Themes
The application supports dark and light themes. You can customize colors in:
- `src/app/globals.css` for global theme variables
- Individual component files for component-specific styling

### Adding New Features
1. Create new components in `src/components/`
2. Add API endpoints in `src/app/api/`
3. Update the main ChatContainer component to integrate new features

## 🧪 Testing

The project includes several test files for PDF processing:
- `create-test-pdf.js` - Creates test PDF files
- `create-knowledge-base-pdf.js` - Knowledge base testing
- `debug-pdf-import.js` - PDF processing debugging

Run tests with:
```bash
npm test
# or
yarn test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and commit: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Yandex Cloud](https://cloud.yandex.ru/) for providing the GPT API
- [Next.js](https://nextjs.org/) for the excellent React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

## 🐛 Known Issues

- PDF processing may fail on very large files (>10MB)
- Voice input requires HTTPS in production
- Some older browsers may not support all features

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/yourusername/yandex-gpt-chat/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about the issue and your environment

## 🔮 Future Plans

- [ ] Multi-language support
- [ ] Chat history persistence
- [ ] User authentication
- [ ] Advanced PDF annotation features
- [ ] Mobile app version
- [ ] Integration with other AI models
- [ ] Advanced search and filtering
- [ ] Conversation analytics
