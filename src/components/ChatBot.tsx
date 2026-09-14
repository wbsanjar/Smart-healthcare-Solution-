import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertTriangle, Loader2, Trash2, Sparkles } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ChatIllustration } from './Illustrations';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const firstAidResponses: Record<string, string> = {
  'chest pain': `## Chest Pain - Immediate Actions

**If experiencing severe chest pain, call emergency services immediately!**

### Steps to follow:

1. **Call for Help**: Dial emergency services or use the Emergency tab
2. **Stay Calm**: Sit or lie down in a comfortable position
3. **Chew Aspirin**: If not allergic and no contraindications, chew 325mg aspirin
4. **Unlock Door**: Ensure emergency services can access
5. **Do NOT**: Drive yourself or ignore symptoms

### When to seek immediate help:
- Crushing or squeezing chest pain
- Pain spreading to arm, jaw, or back
- Shortness of breath
- Nausea or dizziness
- Cold sweat

**Time is critical - every minute counts!**`,

  bleeding: `## Bleeding - First Aid Guide

### For Minor Bleeding:
1. **Clean**: Wash hands and wound with clean water
2. **Apply Pressure**: Use clean cloth or bandage
3. **Elevate**: Keep injured area above heart if possible
4. **Bandage**: Cover with sterile dressing

### For Severe Bleeding:
1. **Call Emergency**: Use Emergency tab for immediate help
2. **Direct Pressure**: Apply firm, constant pressure
3. **Do NOT Remove**: Keep original cloth, add more if needed
4. **Pressure Points**: Apply pressure to artery if needed
5. **Tourniquet**: Only as absolute last resort

### When to seek emergency care:
- Blood spurting or flowing heavily
- Wound is deep or gaping
- Sign of shock (pale, cold, rapid pulse)
- Embedded objects

**Stay calm and apply continuous pressure!**`,

  breathing: `## Breathing Difficulties - Emergency Guide

**Call emergency services immediately for severe breathing problems!**

### Immediate Steps:

1. **Position**: Sit upright, lean slightly forward
2. **Loosen Clothing**: Remove tight clothing around neck/chest
3. **Fresh Air**: Open windows or go outside if safe
4. **Stay Calm**: Anxiety can worsen breathing difficulties
5. **Use Inhaler**: If prescribed, use as directed

### For Choking:
1. **Encourage Cough**: If person can speak/cough
2. **Heimlich Maneuver**: If choking is complete
3. **Back Blows**: For infants or if Heimlich unsuccessful

### When to call emergency:
- Unable to speak more than a few words
- Lips or face turning blue
- Confusion or loss of consciousness
- Wheezing that doesn't improve with inhaler

**Do not wait - respiratory emergencies are time-critical!**`,

  burn: `## Burn First Aid Guide

### For Minor Burns:

1. **Cool Water**: Run cool (not cold) water for 10-20 minutes
2. **Remove Constrictions**: Remove rings, watches before swelling
3. **Cover**: Use sterile, non-stick bandage
4. **Relieve Pain**: Take over-the-counter pain relief if needed
5. **Don't Burst**: Leave blisters intact

### For Severe Burns:

1. **Call Emergency**: Use Emergency tab immediately
2. **Remove from Source**: Get away from heat source
3. **Do NOT**: Apply ice, butter, or creams
4. **Elevate**: Raise burned area above heart
5. **Cover Loosely**: Use clean cloth

### When it's an emergency:
- Burns covering large area
- Burns on face, hands, feet, genitals
- Third-degree burns (white/charred skin)
- Electrical or chemical burns
- Difficulty breathing

**Cool water is your best first response!**`,

  default: `I'm your AI Health Assistant. I can provide first-aid guidance, symptom information, and help you through medical emergencies.

### I can help with:
- 🩹 First-aid for injuries
- ❤️ Heart-related emergencies
- 🫁 Breathing difficulties
- 🔥 Burns and scalds
- 🤒 Fever and infections
- 💊 Medication questions
- 🚨 When to seek emergency care

**Please describe your symptoms or emergency situation.**

⚠️ **Important**: This AI provides general guidance only. Always seek professional medical help for serious conditions. Use the Emergency tab for immediate assistance.`,

  fever: `## Fever Management Guide

### For Adults:

1. **Hydrate**: Drink plenty of fluids (water, broth, electrolyte drinks)
2. **Rest**: Get adequate rest
3. **Temperature Control**: Light clothing, room temperature 20-22°C
4. **Medication**: Acetaminophen or ibuprofen if needed
5. **Tepid Bath**: Lukewarm bath if temperature very high

### Seek Help If:
- Temperature above 39.4°C (103°F)
- Fever lasts more than 3 days
- Severe headache, stiff neck
- Difficulty breathing
- Confusion or altered consciousness
- Persistent vomiting

### For Children:
- **Infants under 3 months**: Any fever - seek immediate care
- **3-6 months**: Fever above 38.9°C - call doctor
- **Over 6 months**: Follow adult guidelines

**Stay hydrated and monitor temperature regularly!**`,

  allergic: `## Allergic Reaction Guide

### Mild Allergic Reaction:
1. **Identify Trigger**: Remove suspected allergen
2. **Antihistamines**: Take over-the-counter allergy medication
3. **Cold Compress**: Apply to reduce swelling
4. **Monitor**: Watch for worsening symptoms

### Severe Allergic Reaction (Anaphylaxis):

**Call Emergency Immediately!**

1. **Use EpiPen**: If available, use as directed
2. **Position**: Lie flat with legs elevated
3. **Do NOT**: Stand or walk
4. **Stay Calm**: Keep the person calm
5. **Second Dose**: If no improvement after 5-15 minutes

### Signs of Anaphylaxis:
- Swelling of lips, tongue, throat
- Difficulty breathing or swallowing
- Wheezing or persistent cough
- Dizziness or collapse
- Rapid pulse
- Widespread rash

**Anaphylaxis is life-threatening - act fast!**`,

  stroke: `## Stroke Emergency - Act FAST

**Call Emergency Services Immediately!**

### FAST Method:

**F**ace: Ask person to smile - does one side droop?
**A**rm: Can they raise both arms? Does one drift downward?
**S**peech: Is speech slurred or strange?
**T**ime: If any signs, call emergency NOW

### While Waiting:

1. **Note Time**: When symptoms first appeared
2. **Keep Comfortable**: Lay person on their side
3. **Do NOT**: Give food, water, or medication
4. **Monitor**: Check breathing and consciousness
5. **Unlock Door**: For emergency services

### Additional Signs:
- Sudden severe headache
- Confusion or trouble understanding
- Vision problems in one or both eyes
- Dizziness or loss of balance

**"Time is brain" - every minute matters!**`,

  seizure: `## Seizure First Aid

**Stay calm and keep the person safe!**

### During a Seizure:

1. **Protect Head**: Place soft padding beneath head
2. **Clear Space**: Remove nearby hazards
3. **Loosen Clothing**: Around neck if tight
4. **Do NOT**: Hold down, put anything in mouth, or restrain
5. **Time It**: Note seizure duration

### After the Seizure:

1. **Recovery Position**: Roll onto side once movement stops
2. **Stay With Person**: Until fully alert
3. **Be Reassuring**: Speak calmly and gently
4. **Check for Injuries**: Provide first aid if needed
5. **Allow Rest**: Person may be confused or tired

### Call Emergency If:
- Seizure lasts more than 5 minutes
- Another seizure follows immediately
- Person is injured during seizure
- Person has difficulty breathing
- Seizure occurs in water
- First-time seizure

**Protect and time - most seizures stop within 2 minutes.**`,
};

export function ChatBot() {
  const { userId } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userId) {
      loadOrCreateSession();
    }
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadOrCreateSession = async () => {
    if (!userId) return;

    const { data: existingSessions } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1);

    if (existingSessions && existingSessions.length > 0) {
      const session = existingSessions[0];
      setSessionId(session.id);
      loadMessages(session.id);
    } else {
      const { data: newSession } = await supabase
        .from('chat_sessions')
        .insert({ user_id: userId, title: 'Health Consultation' })
        .select()
        .single();

      if (newSession) {
        setSessionId(newSession.id);
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content: firstAidResponses.default,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    }
  };

  const loadMessages = async (sessionUid: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionUid)
      .order('created_at', { ascending: true });

    if (data && data.length > 0) {
      setMessages(
        data.map((msg) => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: msg.created_at,
        }))
      );
    } else {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: firstAidResponses.default,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const getResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('chest') || input.includes('heart') || input.includes('cardiac')) {
      return firstAidResponses['chest pain'];
    }
    if (input.includes('bleed') || input.includes('cut') || input.includes('wound')) {
      return firstAidResponses.bleeding;
    }
    if (input.includes('breath') || input.includes('chok') || input.includes('respiratory')) {
      return firstAidResponses.breathing;
    }
    if (input.includes('burn') || input.includes('scald') || input.includes('fire')) {
      return firstAidResponses.burn;
    }
    if (input.includes('fever') || input.includes('temperature') || input.includes('hot')) {
      return firstAidResponses.fever;
    }
    if (input.includes('allerg') || input.includes('sting') || input.includes('bite')) {
      return firstAidResponses.allergic;
    }
    if (input.includes('stroke') || input.includes('face droop') || input.includes('f.a.s.t')) {
      return firstAidResponses.stroke;
    }
    if (input.includes('seizure') || input.includes('convuls') || input.includes('epilepsy')) {
      return firstAidResponses.seizure;
    }

    return `I understand you're asking about "${userInput}". Here's some general guidance:

### General First Aid Principles:

1. **Assess the Situation**: Ensure scene is safe
2. **Call for Help**: Use Emergency tab if serious
3. **Stay Calm**: Your calm demeanor helps the patient
4. **Do No Harm**: Don't move patient unless necessary
5. **Document**: Note symptoms and timing

### Important:
- If you're unsure about severity, it's better to seek help
- Use the Emergency tab for life-threatening situations
- Check nearby hospitals using the Hospitals tab

**Could you provide more specific symptoms or describe what happened? This will help me give more targeted first-aid guidance.**`;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !userId || !sessionId) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);

    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      user_id: userId,
      role: 'user',
      content: userMessage,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = getResponse(userMessage);
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);

    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      user_id: userId,
      role: 'assistant',
      content: response,
    });
  };

  const clearChat = async () => {
    if (!sessionId) return;

    await supabase.from('chat_sessions').update({ status: 'closed' }).eq('id', sessionId);

    setMessages([]);
    setSessionId(null);
    loadOrCreateSession();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="from-brand-600 to-brand-700 px-6 py-4 text-white flex items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-6 -right-6 w-24 h-24 border border-white rounded-full animate-float" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 border border-white rounded-full animate-float-slow" />
          <div className="absolute top-10 left-20 w-16 h-16 border border-white rounded-full animate-float-delayed" />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg animate-scale-in">
            <Bot className="w-5 h-5" />
          </div>
          <div className="animate-fade-in-up">
            <h2 className="font-semibold">AI Health Assistant</h2>
            <p className="text-sm text-brand-100">First-aid guidance & symptom analysis</p>
          </div>
          <div className="hidden sm:flex items-center gap-1 ml-4 px-2 py-1 bg-white/10 rounded-full animate-fade-in-up-1">
            <Sparkles className="w-3 h-3 animate-pulse-soft" />
            <span className="text-xs">Powered by AI</span>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <div className="hidden sm:block w-10 h-10">
            <ChatIllustration className="w-full h-full" />
          </div>
          <button
            onClick={clearChat}
            className="p-2 hover:bg-white/20 rounded-lg transition"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end animate-slide-in-right' : 'justify-start animate-slide-in-left'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="space-y-2">
                {message.content.split('\n').map((line, i) => {
                  if (line.startsWith('##')) {
                    return (
                      <h3 key={i} className="font-semibold text-gray-900 text-base">
                        {line.replace('## ', '')}
                      </h3>
                    );
                  }
                  if (line.startsWith('###')) {
                    return (
                      <h4 key={i} className="font-semibold text-gray-800 text-sm mt-2">
                        {line.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <p key={i} className="font-semibold text-gray-900">
                        {line.replace(/\*\*/g, '')}
                      </p>
                    );
                  }
                  if (line.startsWith('- ') || line.match(/^\d\./)) {
                    return (
                      <p key={i} className="text-sm text-gray-700 ml-2">
                        {line}
                      </p>
                    );
                  }
                  if (line.trim()) {
                    return (
                      <p key={i} className="text-sm">
                        {line}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
              <p
                className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-brand-200' : 'text-gray-400'
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start animate-slide-in-left">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                <span className="text-sm text-gray-600">Analyzing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4 bg-gray-50 animate-fade-in-up">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <span className="font-semibold">Medical Disclaimer: </span>
              This AI provides general first-aid guidance only. For serious conditions, always seek
              professional medical help. Use the Emergency tab for immediate assistance.
            </div>
          </div>
        </div>

        <form onSubmit={handleSend} className="flex gap-3 animate-fade-in-up-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms or emergency..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-brand-500 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
