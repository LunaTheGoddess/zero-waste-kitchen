import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Search, Filter, ArrowUpRight, ArrowDownRight, Package, Trash2, Edit2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface HistoryEntry {
  id: string;
  ingredientName: string;
  action: "added" | "updated" | "deleted" | "used";
  quantity?: number;
  unit?: string;
  timestamp: Date;
  details?: string;
}

// Sample history data
const sampleHistory: HistoryEntry[] = [
  { id: "1", ingredientName: "Tomatoes", action: "added", quantity: 10, unit: "pcs", timestamp: new Date("2026-01-30T14:30:00") },
  { id: "2", ingredientName: "Olive Oil", action: "used", quantity: 50, unit: "ml", timestamp: new Date("2026-01-30T12:15:00"), details: "Used for pasta" },
  { id: "3", ingredientName: "Chicken Breast", action: "added", quantity: 2, unit: "lb", timestamp: new Date("2026-01-29T16:00:00") },
  { id: "4", ingredientName: "Basil", action: "updated", timestamp: new Date("2026-01-29T10:30:00"), details: "Changed quantity from 2 to 1" },
  { id: "5", ingredientName: "Milk", action: "deleted", timestamp: new Date("2026-01-28T09:00:00"), details: "Expired" },
  { id: "6", ingredientName: "Parmesan", action: "used", quantity: 30, unit: "g", timestamp: new Date("2026-01-28T19:45:00"), details: "Used for carbonara" },
  { id: "7", ingredientName: "Garlic", action: "added", quantity: 3, unit: "pcs", timestamp: new Date("2026-01-27T11:20:00") },
  { id: "8", ingredientName: "Pasta", action: "used", quantity: 200, unit: "g", timestamp: new Date("2026-01-27T18:30:00") },
  { id: "9", ingredientName: "Eggs", action: "added", quantity: 12, unit: "pcs", timestamp: new Date("2026-01-26T10:00:00") },
  { id: "10", ingredientName: "Butter", action: "updated", timestamp: new Date("2026-01-25T15:00:00"), details: "Updated expiry date" },
];

const actionConfig = {
  added: { icon: Plus, color: "bg-sage/50 text-olive", label: "Added" },
  updated: { icon: Edit2, color: "bg-secondary text-secondary-foreground", label: "Updated" },
  deleted: { icon: Trash2, color: "bg-destructive/10 text-destructive", label: "Deleted" },
  used: { icon: ArrowDownRight, color: "bg-honey/30 text-olive", label: "Used" },
};

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const filteredHistory = useMemo(() => {
    return sampleHistory.filter((entry) => {
      const matchesSearch = entry.ingredientName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAction = actionFilter === "all" || entry.action === actionFilter;
      return matchesSearch && matchesAction;
    });
  }, [searchQuery, actionFilter]);

  const groupedHistory = useMemo(() => {
    const groups: Record<string, HistoryEntry[]> = {};
    filteredHistory.forEach((entry) => {
      const dateKey = entry.timestamp.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
    });
    return groups;
  }, [filteredHistory]);

  const stats = useMemo(() => {
    const thisWeek = sampleHistory.filter((e) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return e.timestamp >= weekAgo;
    });
    return {
      added: thisWeek.filter((e) => e.action === "added").length,
      used: thisWeek.filter((e) => e.action === "used").length,
      updated: thisWeek.filter((e) => e.action === "updated").length,
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2"
        >
          Ingredient History
        </motion.h1>
        <p className="text-muted-foreground">
          Track all changes and usage of your ingredients over time.
        </p>
      </div>

      {/* Weekly Stats Pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3 mb-6"
      >
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">This week:</span>
          <div className="flex flex-wrap gap-3">
            {/* Added Pill */}
            <div className="flex items-center gap-2 bg-sage/50 backdrop-blur-sm rounded-full px-4 py-1.5 border border-sage-dark/40 shadow-soft">
              <ArrowUpRight className="h-4 w-4 text-sage-dark" />
              <span className="text-xs font-medium text-olive uppercase tracking-wider">Added</span>
              <span className="text-sm font-bold text-olive">{stats.added}</span>
            </div>

            {/* Used Pill */}
            <div className="flex items-center gap-2 bg-honey/5 backdrop-blur-sm rounded-full px-4 py-1.5 border border-honey/60 shadow-soft">
              <ArrowDownRight className="h-4 w-4 text-honey" />
              <span className="text-xs font-medium text-honey uppercase tracking-wider">Used</span>
              <span className="text-sm font-bold text-honey">{stats.used}</span>
            </div>

            {/* Updated Pill */}
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-1.5 border border-border shadow-soft">
              <Edit2 className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Updated</span>
              <span className="text-sm font-bold text-foreground">{stats.updated}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[140px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="added">Added</SelectItem>
            <SelectItem value="used">Used</SelectItem>
            <SelectItem value="updated">Updated</SelectItem>
            <SelectItem value="deleted">Deleted</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* History Timeline */}
      <div className="space-y-8">
        {Object.entries(groupedHistory).length > 0 ? (
          Object.entries(groupedHistory).map(([date, entries], groupIndex) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <h2 className="font-serif text-lg font-semibold text-foreground">{date}</h2>
              </div>

              <div className="space-y-3 ml-4 border-l-2 border-border pl-6">
                {entries.map((entry, index) => {
                  const config = actionConfig[entry.action];
                  const Icon = config.icon;
                  
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative"
                    >
                      {/* Timeline dot */}
                      <div className="absolute -left-[29px] top-3 h-3 w-3 rounded-full bg-border border-2 border-background" />
                      
                      <div className="bg-card rounded-xl p-4 border border-border shadow-soft hover:shadow-card transition-all duration-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0", config.color)}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-serif font-semibold text-foreground">
                                  {entry.ingredientName}
                                </span>
                                <Badge variant="secondary" className={cn("text-xs", config.color)}>
                                  {config.label}
                                </Badge>
                              </div>
                              {entry.quantity && (
                                <p className="text-sm text-muted-foreground">
                                  {entry.quantity} {entry.unit}
                                </p>
                              )}
                              {entry.details && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {entry.details}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {entry.timestamp.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
              No history found
            </h3>
            <p className="text-muted-foreground">
              {searchQuery || actionFilter !== "all"
                ? "Try adjusting your filters"
                : "Start adding ingredients to see your history"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}