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
import { Settings, RefreshCw } from "lucide-react";
import ThemeSettings from './ThemeSettings';
import FontSettings from './FontSettings';
import DisplaySettings from './DisplaySettings';
import PatternSettings from './PatternSettings';

export default function SettingsDialog() {
  const dispatch = useAppDispatch();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reader Settings</DialogTitle>
          <DialogDescription>
            Customize the reading experience to your preferences.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="theme" className="mt-2">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="font">Font</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="pattern">Pattern</TabsTrigger>
          </TabsList>
          <div className="py-4">
            <TabsContent value="theme" className="mt-0">
              <ThemeSettings />
            </TabsContent>
            <TabsContent value="font" className="mt-0">
              <FontSettings />
            </TabsContent>
            <TabsContent value="display" className="mt-0">
              <DisplaySettings />
            </TabsContent>
            <TabsContent value="pattern" className="mt-0">
              <PatternSettings />
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter>
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