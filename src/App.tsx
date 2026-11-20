import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Feather } from 'lucide-react';
import { AmbientParticles } from './components/AmbientParticles';
import { PersonalizationEditor } from './components/PersonalizationEditor';
import { SceneOneDoor } from './components/scenes/SceneOneDoor';
import { SceneTwoPhoto } from './components/scenes/SceneTwoPhoto';
import { SceneThreeJourney } from './components/scenes/SceneThreeJourney';
import { SceneFourLetter } from './components/scenes/SceneFourLetter';
import { SceneFiveVoice } from './components/scenes/SceneFiveVoice';
import { SceneSixLittleThings } from './components/scenes/SceneSixLittleThings';
import { SceneSevenFinale } from './components/scenes/SceneSevenFinale';
import { mergeConfig } from './data/defaultConfig';
import type { BirthdayConfig } from './types/birthday';
import { clearSavedConfig, loadSavedConfig, saveConfig } from './utils/storage';

function StorybookDivider() {
  return (
    <div className="flex items-center justify-center py-4 px-8" aria-hidden="true">
      <div className="h-px w-16 bg-[#715447]/15" />
      <svg viewBox="0 0 24 24" className="w-4 h-4 mx-3 text-[#E9AEBB]">
        <path
          d="M12 6C12 6 8.5 2.5 5.5 5C2.5 7.5 4.5 13 12 18.5C19.5 13 21.5 7.5 18.5 5C15.5 2.5 12 6 12 6Z"
          fill="currentColor"
        />
      </svg>
      <div className="h-px w-16 bg-[#715447]/15" />
    </div>
  );
}

export default function App() {
  const [config, setConfig] = useState<BirthdayConfig>(() => mergeConfig(null));
  const [isExported, setIsExported] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [enteredStory, setEnteredStory] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [previewAsRecipient, setPreviewAsRecipient] = useState(false);

  useEffect(() => {
    let active = true;
    loadSavedConfig().then((result) => {
      if (!active) return;
      setConfig(result.config);
      setIsExported(result.isExported);
      setIsLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async () => {
    await saveConfig(config);
  };

  const handleReset = async () => {
    await clearSavedConfig();
    const defaults = mergeConfig(null);
    setConfig(defaults);
  };

  const handleEnterStory = () => {
    setEnteredStory(true);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleRestartStory = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.setTimeout(() => {
      setEnteredStory(false);
    }, 350);
  };

  const showEditorTrigger = isLoaded && !isExported && !previewAsRecipient;

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#FFF5E9] text-[#4E382E] paper-grain">
        <AmbientParticles />

        {/* Discreet Personalization Trigger (Hidden in exported recipient site) */}
        {showEditorTrigger && (
          <button
            type="button"
            onClick={() => setEditorOpen(true)}
            aria-label="Personalize this website"
            title="Personalize this website"
            className="fixed top-4 right-4 z-40 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-[#715447] opacity-25 hover:opacity-85 hover:bg-[#FFFDF9]/80 transition-all duration-200 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-[#C95B63] cursor-pointer"
          >
            <Feather className="w-4 h-4" />
          </button>
        )}

        {/* Temporary Exit Recipient Preview button (Only shown during local preview) */}
        {!isExported && previewAsRecipient && (
          <button
            type="button"
            onClick={() => {
              setPreviewAsRecipient(false);
              setEditorOpen(true);
            }}
            className="fixed bottom-4 right-4 z-40 min-h-[40px] px-4 py-2 rounded-full bg-[#4E382E]/85 text-[#FFFDF9] text-xs font-medium shadow-lg hover:bg-[#4E382E] transition-colors cursor-pointer"
          >
            Back to Editor
          </button>
        )}

        <AnimatePresence mode="wait">
          {!enteredStory ? (
            <SceneOneDoor
              key="scene-one"
              openingTitle={config.openingTitle}
              openingSubtitle={config.openingSubtitle}
              onEnter={handleEnterStory}
            />
          ) : (
            <motion.main
              key="storybook-pages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-20"
            >
              <SceneTwoPhoto
                photoTitle={config.photoTitle}
                photoSubtitle={config.photoSubtitle}
                photoHandwrittenNote={config.photoHandwrittenNote}
                photoDataUrl={config.photoDataUrl}
              />

              <StorybookDivider />

              <SceneThreeJourney
                heading={config.journeyHeading}
                messages={config.journeyMessages}
              />

              <StorybookDivider />

              <SceneFourLetter
                heading={config.letterHeading}
                letterBody={config.letterBody}
              />

              <StorybookDivider />

              <SceneFiveVoice
                heading={config.voiceHeading}
                subtitle={config.voiceSubtitle}
                audioDataUrl={config.audioDataUrl}
                audioFileName={config.audioFileName}
              />

              <StorybookDivider />

              <SceneSixLittleThings
                heading={config.giftsHeading}
                giftMessages={config.giftMessages}
              />

              <SceneSevenFinale
                finaleLine1={config.finaleLine1}
                finaleLine2={config.finaleLine2}
                finaleGreeting={config.finaleGreeting}
                finaleClosing={config.finaleClosing}
                onRestart={handleRestartStory}
              />
            </motion.main>
          )}
        </AnimatePresence>

        {!isExported && (
          <PersonalizationEditor
            isOpen={editorOpen}
            onClose={() => setEditorOpen(false)}
            config={config}
            onChange={setConfig}
            onSave={handleSave}
            onReset={handleReset}
            onPreviewAsRecipient={() => {
              setEditorOpen(false);
              setPreviewAsRecipient(true);
            }}
          />
        )}
      </div>
    </MotionConfig>
  );
}
