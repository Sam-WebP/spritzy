'use client';

import { useAppDispatch } from '@/redux/hooks';
import { resetSettings } from '@/redux/slices/settingsSlice';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, RefreshCw } from "lucide-react";
import FontSettings from './FontSettings';
import DisplaySettings from './DisplaySettings';
import PatternSettings from './PatternSettings';
import MicroPauseSettings from './MicroPauseSettings';
import QuizSettings from './QuizSettings';

export default function SettingsDialog() {
  const dispatch = useAppDispatch();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Reader Settings</DialogTitle>
          <DialogDescription>
            Customize the reading experience to your preferences.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="display" className="mt-2">
          <TabsList className="flex w-full h-auto flex-wrap">
            <TabsTrigger value="display" className="flex-1 py-1 px-2">Display</TabsTrigger>
            <TabsTrigger value="font" className="flex-1 py-1 px-2">Font</TabsTrigger>
            <TabsTrigger value="quiz" className="flex-1 py-1 px-2">Quiz</TabsTrigger>
            <TabsTrigger value="advanced" className="flex-1 py-1 px-2">Advanced</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[calc(90vh-220px)] mt-4">
            <div className="py-4 pr-4 pb-8">
              <TabsContent value="display" className="mt-0">
                <DisplaySettings />
              </TabsContent>
              <TabsContent value="font" className="mt-0">
                <FontSettings />
              </TabsContent>
              <TabsContent value="quiz" className="mt-0">
                <QuizSettings />
              </TabsContent>
              <TabsContent value="advanced" className="mt-0 space-y-8">
                <PatternSettings />
                <MicroPauseSettings />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="mt-2 pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => dispatch(resetSettings())}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}