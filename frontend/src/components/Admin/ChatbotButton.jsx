import { useState, useEffect, useRef } from 'react';

export default function ChatbotButton() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const buttonRef = useRef(null);
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Quick questions for admin
  const quickQuestions = [
    'Cách thêm bệnh nhân mới?',
    'Làm thế nào để phân ca cho nhân viên?',
    'Cách quản lý phòng bệnh?',
    'Hướng dẫn tạo lịch hẹn tư vấn',
    'Cách xem báo cáo thống kê?',
    'Làm thế nào để gán bệnh nhân cho điều dưỡng?'
  ];

  // Load position from localStorage on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem('chatbotPosition');
    if (savedPosition) {
      try {
        const { x, y } = JSON.parse(savedPosition);
        setPosition({ x, y });
      } catch (error) {
        console.error('Error loading chatbot position:', error);
      }
    } else {
      // Default position: bottom right
      setPosition({ 
        x: window.innerWidth - 80, 
        y: window.innerHeight - 80 
      });
    }
  }, []);

  // Save position to localStorage whenever it changes
  useEffect(() => {
    if (position.x !== 0 || position.y !== 0) {
      localStorage.setItem('chatbotPosition', JSON.stringify(position));
    }
  }, [position]);

  // Handle mouse/touch down - start dragging
  const handleStart = (clientX, clientY) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top
      });
      setIsDragging(true);
      setHasDragged(false); // Reset on new drag start
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  // Handle mouse/touch move - update position while dragging
  useEffect(() => {
    const updatePosition = (clientX, clientY) => {
      if (isDragging) {
        const newX = clientX - dragOffset.x;
        const newY = clientY - dragOffset.y;
        
        // Check if position actually changed (to detect real drag vs click)
        const currentX = position.x;
        const currentY = position.y;
        const moved = Math.abs(newX - currentX) > 2 || Math.abs(newY - currentY) > 2;
        
        if (moved) {
          setHasDragged(true);
        }
        
        // Constrain to viewport bounds
        const maxX = window.innerWidth - 64; // button width
        const maxY = window.innerHeight - 64; // button height
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseMove = (e) => {
      e.preventDefault();
      updatePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, dragOffset, position]);

  // Handle click - toggle chat
  const handleClick = (e) => {
    // Only trigger click if not dragging (prevent click after drag)
    if (!isDragging && !hasDragged) {
      if (isChatOpen) {
        setIsChatOpen(false);
        setIsExpanded(false);
      } else {
        setIsChatOpen(true);
      }
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputMessage;
    setInputMessage('');

    // Simulate bot response (có thể tích hợp API sau)
    setTimeout(() => {
      let botResponse = '';
      
      // Simple response logic based on keywords
      if (messageText.toLowerCase().includes('bệnh nhân') || messageText.toLowerCase().includes('thêm')) {
        botResponse = 'Để thêm bệnh nhân mới:\n1. Vào menu "Bệnh nhân"\n2. Click nút "Thêm bệnh nhân"\n3. Điền đầy đủ thông tin\n4. Click "Lưu" để hoàn tất';
      } else if (messageText.toLowerCase().includes('phân ca') || messageText.toLowerCase().includes('ca')) {
        botResponse = 'Để phân ca cho nhân viên:\n1. Vào menu "Nhân viên"\n2. Click nút "Phân ca" bên cạnh tên nhân viên\n3. Click "Thêm phân ca"\n4. Chọn ngày, ca và trạng thái\n5. Click "Thêm" để lưu';
      } else if (messageText.toLowerCase().includes('phòng') || messageText.toLowerCase().includes('quản lý phòng')) {
        botResponse = 'Để quản lý phòng bệnh:\n1. Vào menu "Quản lý Phòng"\n2. Xem danh sách phòng và trạng thái\n3. Click vào phòng để xem chi tiết\n4. Có thể cập nhật thông tin phòng tại đây';
      } else if (messageText.toLowerCase().includes('lịch hẹn') || messageText.toLowerCase().includes('tư vấn')) {
        botResponse = 'Để tạo lịch hẹn tư vấn:\n1. Vào menu "Lịch hẹn tư vấn"\n2. Click "Thêm lịch hẹn"\n3. Điền thông tin khách hàng và thời gian\n4. Click "Lưu" để hoàn tất';
      } else if (messageText.toLowerCase().includes('báo cáo') || messageText.toLowerCase().includes('thống kê')) {
        botResponse = 'Để xem báo cáo thống kê:\n1. Vào trang "Dashboard"\n2. Xem các biểu đồ và số liệu thống kê\n3. Có thể lọc theo thời gian để xem chi tiết';
      } else if (messageText.toLowerCase().includes('gán') || messageText.toLowerCase().includes('điều dưỡng')) {
        botResponse = 'Để gán bệnh nhân cho điều dưỡng:\n1. Vào menu "Nhân viên"\n2. Click "Quản lý BN" bên cạnh điều dưỡng\n3. Click "Gán bệnh nhân mới"\n4. Chọn bệnh nhân và ngày bắt đầu\n5. Click "Gán bệnh nhân" để hoàn tất';
      } else {
        botResponse = 'Xin chào! Tôi là chatbot hỗ trợ. Tôi có thể giúp bạn với:\n- Thêm và quản lý bệnh nhân\n- Phân ca cho nhân viên\n- Quản lý phòng bệnh\n- Tạo lịch hẹn tư vấn\n- Xem báo cáo thống kê\n- Gán bệnh nhân cho điều dưỡng\n\nBạn muốn biết thêm về chức năng nào?';
      }

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  // Handle quick question click
  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    // Auto send after setting message
    setTimeout(() => {
      const userMessage = {
        id: Date.now(),
        text: question,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);

      // Bot response
      setTimeout(() => {
        let botResponse = '';
        if (question.includes('bệnh nhân') || question.includes('thêm')) {
          botResponse = 'Để thêm bệnh nhân mới:\n1. Vào menu "Bệnh nhân"\n2. Click nút "Thêm bệnh nhân"\n3. Điền đầy đủ thông tin\n4. Click "Lưu" để hoàn tất';
        } else if (question.includes('phân ca')) {
          botResponse = 'Để phân ca cho nhân viên:\n1. Vào menu "Nhân viên"\n2. Click nút "Phân ca" bên cạnh tên nhân viên\n3. Click "Thêm phân ca"\n4. Chọn ngày, ca và trạng thái\n5. Click "Thêm" để lưu';
        } else if (question.includes('phòng')) {
          botResponse = 'Để quản lý phòng bệnh:\n1. Vào menu "Quản lý Phòng"\n2. Xem danh sách phòng và trạng thái\n3. Click vào phòng để xem chi tiết\n4. Có thể cập nhật thông tin phòng tại đây';
        } else if (question.includes('lịch hẹn')) {
          botResponse = 'Để tạo lịch hẹn tư vấn:\n1. Vào menu "Lịch hẹn tư vấn"\n2. Click "Thêm lịch hẹn"\n3. Điền thông tin khách hàng và thời gian\n4. Click "Lưu" để hoàn tất';
        } else if (question.includes('báo cáo')) {
          botResponse = 'Để xem báo cáo thống kê:\n1. Vào trang "Dashboard"\n2. Xem các biểu đồ và số liệu thống kê\n3. Có thể lọc theo thời gian để xem chi tiết';
        } else if (question.includes('gán')) {
          botResponse = 'Để gán bệnh nhân cho điều dưỡng:\n1. Vào menu "Nhân viên"\n2. Click "Quản lý BN" bên cạnh điều dưỡng\n3. Click "Gán bệnh nhân mới"\n4. Chọn bệnh nhân và ngày bắt đầu\n5. Click "Gán bệnh nhân" để hoàn tất';
        }

        const botMessage = {
          id: Date.now() + 1,
          text: botResponse,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }, 500);
    }, 100);
  };

  // Handle window resize - adjust position if needed
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 64),
        y: Math.min(prev.y, window.innerHeight - 64)
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset hasDragged when drag ends
  useEffect(() => {
    if (!isDragging) {
      // Reset after a short delay to allow click detection
      const timer = setTimeout(() => {
        if (!hasDragged) {
          // Only trigger click if we didn't drag
        }
        setHasDragged(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isDragging, hasDragged]);

  // Calculate chat window position - always bottom right, or expanded to center
  const getChatPosition = () => {
    if (isExpanded) {
      // Expanded mode: center of screen, larger size
      return {
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        right: 'auto',
        bottom: 'auto',
        width: '600px',
        height: '700px',
        maxWidth: '90vw',
        maxHeight: '90vh'
      };
    } else {
      // Normal mode: bottom right corner
      const chatWidth = 380;
      const chatHeight = 500;
      return {
        right: '24px',
        bottom: '100px', // Above the button
        left: 'auto',
        top: 'auto',
        transform: 'none',
        width: `${chatWidth}px`,
        height: `${chatHeight}px`,
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: 'calc(100vh - 32px)'
      };
    }
  };

  return (
    <>
      {/* Overlay - Close chat when clicking outside */}
      {isChatOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[9998]"
          onClick={() => {
            setIsChatOpen(false);
            setIsExpanded(false);
          }}
        />
      )}

      {/* Chat Interface */}
      {isChatOpen && (
        <div
          ref={chatRef}
          style={{
            position: 'fixed',
            ...getChatPosition(),
            zIndex: 10000
          }}
          className="bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Chat Header */}
          <div className="bg-[#4A90E2] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span 
                  className="material-symbols-outlined text-white text-xl" 
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
                >
                  smart_toy
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Chatbot Hỗ trợ</h3>
                <p className="text-xs text-white/80">Trực tuyến</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                title={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
              >
                <span 
                  className="material-symbols-outlined text-white text-xl" 
                  style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
                >
                  {isExpanded ? 'close_fullscreen' : 'open_in_full'}
                </span>
              </button>
              <button
                onClick={() => {
                  setIsChatOpen(false);
                  setIsExpanded(false);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
              >
                <span 
                  className="material-symbols-outlined text-white text-xl" 
                  style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
                >
                  close
                </span>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-[#4A90E2]/10 rounded-full flex items-center justify-center mb-4">
                  <span 
                    className="material-symbols-outlined text-[#4A90E2] text-3xl" 
                    style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
                  >
                    smart_toy
                  </span>
                </div>
                <p className="text-gray-600 text-sm font-medium mb-2">Xin chào! Tôi có thể giúp gì cho bạn?</p>
                <p className="text-gray-400 text-xs mb-4">Chọn câu hỏi nhanh hoặc gửi tin nhắn để bắt đầu</p>
                
                {/* Quick Questions */}
                <div className="w-full space-y-2 px-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="w-full text-left px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-[#4A90E2]/5 hover:border-[#4A90E2]/30 transition-colors text-sm text-gray-700"
                    >
                      <div className="flex items-start gap-2">
                        <span 
                          className="material-symbols-outlined text-[#4A90E2] text-base flex-shrink-0 mt-0.5" 
                          style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
                        >
                          help_outline
                        </span>
                        <span className="flex-1">{question}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-[#4A90E2] text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                      {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {/* Quick Questions - Show when there are messages */}
            {messages.length > 0 && messages[messages.length - 1]?.sender === 'bot' && (
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 font-medium mb-2">Câu hỏi thường gặp:</p>
                <div className="grid grid-cols-1 gap-2">
                  {quickQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-left px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-[#4A90E2]/5 hover:border-[#4A90E2]/30 transition-colors text-xs text-gray-700"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-end gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800"
                autoFocus
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="w-10 h-10 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <span 
                  className="material-symbols-outlined text-xl" 
                  style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
                >
                  send
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chatbot Button */}
      <div
        ref={buttonRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={(e) => {
          if (!hasDragged) {
            handleClick(e);
          }
        }}
        className="group"
      >
        <div
          className={`
            w-16 h-16 rounded-full bg-[#4A90E2] 
            shadow-lg hover:shadow-xl 
            flex items-center justify-center
            transition-all duration-200
            ${isDragging ? 'scale-95' : 'hover:scale-110'}
            ${isChatOpen ? 'ring-4 ring-[#4A90E2]/30' : ''}
            active:scale-95
          `}
        >
          <span 
            className="material-symbols-outlined text-white text-3xl transition-transform duration-200" 
            style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
          >
            {isChatOpen ? 'close' : 'smart_toy'}
          </span>
        </div>
        
        {/* Tooltip */}
        {!isDragging && !isChatOpen && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {isChatOpen ? 'Đóng chat' : 'Mở chat'}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    </>
  );
}

