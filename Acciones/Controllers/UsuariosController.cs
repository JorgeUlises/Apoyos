using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Acciones.Models;

namespace Acciones.Controllers
{
    public class UsuariosController : Controller
    {
        private readonly dbAccionesContext _context;

        public UsuariosController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Usuarios
        public async Task<IActionResult> Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            var dbAccionesContext = _context.Usuarios.Include(u => u.Diputado).Include(u => u.Rol);
            return View(await dbAccionesContext.ToListAsync());
        }

        // GET: Usuarios/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var usuario = await _context.Usuarios
                .Include(u => u.Diputado)
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(m => m.UsuarioId == id);
            if (usuario == null)
            {
                return NotFound();
            }

            return View(usuario);
        }

        // GET: Usuarios/Create
        public IActionResult Create()
        {
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId");
            ViewData["RolId"] = new SelectList(_context.Roles, "RolId", "Nombre");
            return View();
        }

        // POST: Usuarios/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("UsuarioId,Paterno,Materno,Nombre,Puesto,Telefono,DiputadoId,Clave,Contrasena,RolId,Email,Estatus,UsuarioRegistroId,FechaRegistro,FechaUltimoCambio")] Usuario usuario)
        {
            if (ModelState.IsValid)
            {
                usuario.Contrasena = TokenProvider.ComputeSha256Hash(usuario.Contrasena);
                _context.Add(usuario);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId", usuario.DiputadoId);
            ViewData["RolId"] = new SelectList(_context.Roles, "RolId", "Nombre", usuario.RolId);
            return View(usuario);
        }

        // GET: Usuarios/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }


            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId", usuario.DiputadoId);
            ViewData["RolId"] = new SelectList(_context.Roles, "RolId", "Nombre", usuario.RolId);
            return View(usuario);
        }

        // POST: Usuarios/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("UsuarioId,Paterno,Materno,Nombre,Puesto,Telefono,DiputadoId,Clave,Contrasena,RolId,Email,Estatus,UsuarioRegistroId,FechaRegistro,FechaUltimoCambio")] Usuario usuario)
        {
            if (id != usuario.UsuarioId)
            {
                return NotFound();
            }

            usuario.Contrasena = TokenProvider.ComputeSha256Hash(usuario.Contrasena);

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(usuario);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UsuarioExists(usuario.UsuarioId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId", usuario.DiputadoId);
            ViewData["RolId"] = new SelectList(_context.Roles, "RolId", "Nombre", usuario.RolId);
            return View(usuario);
        }

        // GET: Usuarios/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var usuario = await _context.Usuarios
                .Include(u => u.Diputado)
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(m => m.UsuarioId == id);
            if (usuario == null)
            {
                return NotFound();
            }

            return View(usuario);
        }

        // POST: Usuarios/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool UsuarioExists(int id)
        {
            return _context.Usuarios.Any(e => e.UsuarioId == id);
        }
    }
}
