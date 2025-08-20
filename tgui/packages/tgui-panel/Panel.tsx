/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import React from 'react';
import { Pane } from 'tgui/layouts';
import { Button, Section, Stack } from 'tgui-core/components';

import { NowPlayingWidget, useAudio } from './audio';
import { ChatPanel, ChatTabs } from './chat';
import { useGame } from './game';
import { Notifications } from './Notifications';
import { PingIndicator } from './ping';
import { ReconnectButton } from './reconnect';
import { SettingsPanel, useSettings } from './settings';

export const Panel = (props) => {
  const audio = useAudio();
  const settings = useSettings();
  const game = useGame();
  if (process.env.NODE_ENV !== 'production') {
    const { useDebug, KitchenSink } = require('tgui/debug');
    const debug = useDebug();
    if (debug.kitchenSink) {
      return <KitchenSink panel />;
    }
  }

  // Set UI scale CSS variable
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      '--ui-scale',
      settings.uiScale || 1,
    );
  }, [settings.uiScale]);

  return (
    <Pane theme={settings.theme}>
      <Stack fill vertical>
        <Stack.Item>
          <Section fitted>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto auto',
                gap: '0.5rem',
                alignItems: 'center',
                minWidth: 0,
              }}
            >
              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <ChatTabs />
              </div>
              <PingIndicator />
              <Button
                color="grey"
                selected={audio.visible}
                icon="music"
                tooltip="Music player"
                tooltipPosition="bottom-start"
                onClick={() => audio.toggle()}
              />
              <Button
                icon={settings.visible ? 'times' : 'cog'}
                selected={settings.visible}
                tooltip={settings.visible ? 'Close settings' : 'Open settings'}
                tooltipPosition="bottom-start"
                onClick={() => settings.toggle()}
              />
            </div>
          </Section>
        </Stack.Item>
        {audio.visible && (
          <Stack.Item>
            <Section>
              <NowPlayingWidget />
            </Section>
          </Stack.Item>
        )}
        {settings.visible && (
          <Stack.Item>
            <SettingsPanel />
          </Stack.Item>
        )}
        <Stack.Item grow>
          <Section fill fitted position="relative">
            <Pane.Content scrollable>
              <ChatPanel
                fontSize={settings.fontSize}
                lineHeight={settings.lineHeight}
                uiScale={settings.uiScale || 1}
              />
            </Pane.Content>
            <Notifications>
              {game.connectionLostAt && (
                <Notifications.Item rightSlot={<ReconnectButton />}>
                  You are either AFK, experiencing lag or the connection has
                  closed.
                </Notifications.Item>
              )}
              {game.roundRestartedAt && (
                <Notifications.Item>
                  The connection has been closed because the server is
                  restarting. Please wait while you automatically reconnect.
                </Notifications.Item>
              )}
            </Notifications>
          </Section>
        </Stack.Item>
      </Stack>
    </Pane>
  );
};
