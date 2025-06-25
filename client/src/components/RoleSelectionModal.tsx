import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ROLES_ARRAY } from "@/constants/roles";

interface RoleSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelectRole: (roleId: string) => void;
  playerName: string;
  currentRole?: string;
}

export function RoleSelectionModal({ 
  open, 
  onClose, 
  onSelectRole, 
  playerName, 
  currentRole 
}: RoleSelectionModalProps) {
  
  const handleRoleSelect = (roleId: string) => {
    onSelectRole(roleId);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-game-surface border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Révéler le Rôle - {playerName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ROLES_ARRAY.map((role) => (
              <Button
                key={role.id}
                variant="outline"
                className={`${role.colorClass} bg-opacity-30 border ${role.borderClass} hover:bg-opacity-40 rounded-lg p-4 h-auto transition-all text-left justify-start ${
                  currentRole === role.id ? "ring-2 ring-wolf-purple" : ""
                }`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{role.emoji}</span>
                  <div>
                    <div className={`font-semibold ${role.textClass}`}>
                      {role.name}
                    </div>
                    <div className={`text-xs opacity-75`}>
                      Camp: {role.camp === "village" ? "Village" : role.camp === "wolves" ? "Loups-Garous" : "Neutre"}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-700">
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
